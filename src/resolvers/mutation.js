const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticatinError, ForbiddenError } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config()

module.exports = {
    addHouse: async (parent, { title, description = "null", price, location, houseType, images = "" }, { models }) => {

        if (!title || !price || !location || !houseType) {
            throw new Error("Missing required fields. Ensure all required inputs are provided.");
        }

        // Create a new house object
        return await models.House.create({
            title,
            description, // Default to empty string if null
            price,
            location,
            houseType,
            images,
            owner: "APS",//change to user later
        });


    },

    deleteHouse: async (parent, { houseId }, { models }) => {
        try {
            const house = await models.House.findById(houseId);
            await house.deleteOne();
            console.log("House removed successfully");
            return true;
        } catch (err) {
            console.error("Error removing the house:", err); return false;
        }
    },

    register: async (parent, { username, email, password }, { models }) => {
        email = email.trim().toLowerCase()

        const hashed = await bcrypt.hash(password, 10);

        try {
            //user is created
            const user = await models.User.create({
                username,
                email,
                password: hashed
            });

            // create and return the json web token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,);

            //returns user info along with token
            return { ...user._doc, id: user._id, token, };
        } catch (err) {
            // if there's a problem creating the account, throw an error
            throw new Error(err);
        }
    },

    login: async (parent, { email, password }, { models }) => {
        if (email) { email = email.trim().toLowerCase(); }

        const user = await models.User.findOne({ email });

        if (!user) {
            throw new AuthenticationError('User not found');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new AuthenticationError('Invalid Password');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return { ...user._doc, id: user._id, token, };

    }




}