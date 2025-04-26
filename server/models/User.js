const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    password: String,
    role: String,

    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Accepted connections
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Incoming requests

});
module.exports = mongoose.model('user', UserSchema);