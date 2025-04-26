/*const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/chatController");
const authenticate = require("../middleware/auth-middleware");
const Message = require("../models/Message");




const router = express.Router();

router.post("/send", authenticate, sendMessage); // Send message
router.get("/:userId1/:userId2", authenticate, getChatHistory); // Get chat history




module.exports = router;
*/



//new

/*
const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/chatController");
const authenticate = require("../middleware/auth-middleware");
const Message = require("../models/Message");

const router = express.Router();

// ✅ Send a message
router.post("/send", async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;
        console.log("📩 Received:", { senderId, receiverId, message });

        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();

        // 🔥 Emit message event
        const io = req.app.get("io"); // ✅ Fetch `io` properly
        if (io) {
            io.to(`receiveMessage:${receiverId}`, newMessage);
        } else {
            console.error("❌ Socket.io instance is missing!");
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ message: "Error sending message" });
    }
});


// ✅ Get chat history between two users
router.get("/:userId1/:userId2", async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Error fetching messages" });
    }
});

module.exports = router;


*/


const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// ✅ Send a message (Database Only)
router.post("/send", async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;
        console.log("📩 Received:", { senderId, receiverId, message });

        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();

        // ✅ Emit message via WebSocket
        const io = req.app.get("io");
        if (io) {
            io.to(receiverId).emit("receiveMessage", newMessage);
            console.log(`📩 Sent real-time message to ${receiverId}`);
        } else {
            console.error("❌ Socket.io instance is missing!");
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ message: "Error sending message" });
    }
});

// ✅ Get chat history between two users
router.get("/:userId1/:userId2", async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Error fetching messages" });
    }
});

module.exports = router;
