// Importing the mongoose library
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    dish: {
        type: String,
        required: true,
    },

    ingredients: {
        type: String,
        required: true,
    },

    instructions: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);