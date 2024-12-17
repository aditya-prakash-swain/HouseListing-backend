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

    


}