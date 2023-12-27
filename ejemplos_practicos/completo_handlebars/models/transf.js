const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    destiny: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
},{
    timestamps: true
});

// Create the user model
const Transf = mongoose.model('Transf', userSchema);

module.exports = Transf;