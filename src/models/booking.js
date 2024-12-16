const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookingDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'], // Example statuses
        default: 'pending',
    },
});

const Booking = mongoose.model('Booking', bookingSchema);
// Export the module
module.exports = Booking;