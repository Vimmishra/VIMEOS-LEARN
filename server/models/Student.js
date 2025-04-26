const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    about: String,
    phoneNo: String,
    class: String,
    collegeName: String,
    universityName: String,
    dob: String,
    address: String,
    imageUrl: String,
});

module.exports = mongoose.model("Student", StudentSchema);
