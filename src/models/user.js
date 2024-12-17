const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: { unique: true }

    },
    email: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
    },
    listings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
    }],
});

const User = mongoose.model('User', userSchema);
module.exports = User;