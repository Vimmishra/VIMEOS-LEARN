const Message = require("../models/Message");

// ✅ Send Message (Save to DB)
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        // Validate input
        if (!senderId || !receiverId || !message.trim()) {
            return res.status(400).json({ success: false, message: "Invalid message data" });
        }

        // Save message
        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();

        res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ✅ Get Chat History (Between two users)
exports.getChatHistory = async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;

        // Validate input
        if (!userId1 || !userId2 || userId1 === "undefined" || userId2 === "undefined") {
            return res.status(400).json({ success: false, message: "Invalid user IDs" });
        }

        // Fetch chat history
        const messages = await Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        }).sort({ createdAt: 1 }); // ✅ FIXED: Use `createdAt` instead of `timestamp`

        res.json({ success: true, messages });
    } catch (error) {
        console.error("Error in getChatHistory:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
