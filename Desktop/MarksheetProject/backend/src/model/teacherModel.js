const mongoose = require("mongoose");


const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,

    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },

}, { timestamps: true })

module.exports = mongoose.model("teacher", teacherSchema);