const express = require("express");
const { createPost, getAllPosts, likePost, addComment } = require("../controllers/postController"); // Ensure correct path
const authenticate = require("../middleware/auth-middleware");// Ensure correct path
const upload = require("../middleware/multer-middleware"); // Ensure correct path

const router = express.Router();

// Ensure functions are correctly imported
if (!createPost || !getAllPosts) {
    throw new Error("Error: postController functions are undefined!");
}
if (!authenticate) {
    throw new Error("Error: authenticate middleware is undefined!");
}
if (!upload) {
    throw new Error("Error: Multer upload middleware is undefined!");
}

// Route to create a new post with an image
router.post("/", authenticate, upload.single("image"), createPost);

// Route to get all posts
router.get("/", getAllPosts);




// Like a post
router.put("/:postId/like", likePost);

// Add a comment
router.post("/:postId/comment", addComment);



module.exports = router;
