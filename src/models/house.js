const mongoose = require('mongoose')

const houseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    houseType: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

},
    {
        timestamps: true,
    }
);

const House = mongoose.model('House', houseSchema);
// Export the module
module.exports = House;