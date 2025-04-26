const mongoose = require('mongoose');


// Define collection and schema for Help    

const HelpSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    issue: { type: String, required: true },
})

module.exports = mongoose.model("Help", HelpSchema);