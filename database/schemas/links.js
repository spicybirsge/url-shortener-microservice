const mongoose = require("mongoose");

const links = mongoose.Schema({
    _id: Number,
    original_url: String,
 
})

module.exports = mongoose.model("Links", links)