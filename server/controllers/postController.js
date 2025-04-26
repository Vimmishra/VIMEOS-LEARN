
const Post = require("../models/Post");
const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require("../helpers/cloudinary");

const Student = require("../models/Student");

const createPost = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // ✅ Check form data
        console.log("Uploaded File:", req.file); // ✅ Check uploaded file

        const { userId, userName, content, title } = req.body;
        const imageUrl = req.file ? req.file.path.replace(/\\/g, "/") : null; // ✅ Assign image URL

        const student = await Student.findOne({ userId });
        const postImageUrl = student?.imageUrl || "";

        const newPost = new Post({ userId, userName, content, imageUrl, title, postImageUrl });
        const savedPost = await newPost.save();

        console.log("Saved Post:", savedPost); // ✅ Log saved post
        res.status(201).json(savedPost);

    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const getAllPosts = async (req, res) => {
    try {
        // Fetch all posts
        const posts = await Post.find().sort({ createdAt: -1 });

        // Fetch student profile images for each post
        const postsWithProfileImages = await Promise.all(
            posts.map(async (post) => {
                const student = await Student.findOne({ userId: post.userId });
                return {
                    ...post.toObject(),
                    userProfileImage: student?.imageUrl
                };
            })
        );

        res.status(200).json(postsWithProfileImages);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};





const likePost = async (req, res) => {
    try {
        const { userId } = req.body;
        const post = await Post.findById(req.params.postId);

        if (!post) return res.status(404).json({ message: "Post not found" });

        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId); // Like
        } else {
            post.likes.splice(index, 1); // Unlike
        }

        await post.save();
        res.status(200).json({ success: true, likes: post.likes });
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Error liking post", error });
    }
};



const addComment = async (req, res) => {
    try {
        const { userId, userName, text } = req.body;
        const postId = req.params.postId;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = { userId, userName, text, createdAt: new Date() };

        post.comments.push(newComment);
        await post.save();

        // ✅ Fetch updated post after saving
        const updatedPost = await Post.findById(postId);

        res.status(201).json({ success: true, post: updatedPost });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment", error });
    }
};



module.exports = { createPost, getAllPosts, likePost, addComment };





