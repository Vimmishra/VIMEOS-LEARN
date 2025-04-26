const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        userName: { type: String, required: true },
        content: { type: String, required: true },
        title: { type: String, required: true },

        imageUrl: { type: String },
        mediaType: { type: String }, // image, video, etc.



        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Stores user IDs who liked the post
        comments: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                userName: { type: String, required: true },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],


    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
