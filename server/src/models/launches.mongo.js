const mongoose = require('mongoose');
const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    mission: {
        type: String,
        required: true
    },
    launchDate: {
        type: Date
    },
    rocket: {
        type: String,
        required: true
    },
    customers: [String],
    target: {
        type: String
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
    },
    upcoming: {
        type: Boolean,
        required: true,
        default: true
    },
})

module.exports = mongoose.model('Launch', launchesSchema);
