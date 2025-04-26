const User = require("../models/User");
const Student = require("../models/Student");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.sendConnectionRequest = async (req, res) => {
    try {
        const sender = await User.findById(req.user._id);
        const receiver = await User.findById(req.params.id);

        console.log(sender, "sendid")
        if (!receiver) return res.status(404).json({ message: "User not found" });

        if (receiver.pendingRequests.includes(sender.id))
            return res.status(400).json({ message: "Request already sent" });

        receiver.pendingRequests.push(sender.id);
        await receiver.save();

        res.json({ message: "Connection request sent" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.acceptConnectionRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // The one accepting the request
        const sender = await User.findById(req.params.id); // The one who sent the request

        if (!user || !sender) return res.status(404).json({ message: "User not found" });

        // Ensure request exists
        if (!user.pendingRequests.includes(sender.id)) {
            return res.status(400).json({ message: "No pending request from this user" });
        }

        // Remove from pending requests
        user.pendingRequests = user.pendingRequests.filter(id => id.toString() !== sender.id);

        // Add to connections

        user.connections.push(sender.id);
        sender.connections.push(user.id);

        await user.save();
        await sender.save();

        res.json({ message: "Connection request accepted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, "-password");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



//remover request
exports.removeConnection = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const connectionUser = await User.findById(req.params.id);

        if (!user || !connectionUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove each other from connections list
        user.connections = user.connections.filter(id => id.toString() !== req.params.id);
        connectionUser.connections = connectionUser.connections.filter(id => id.toString() !== req.user._id);

        await user.save();
        await connectionUser.save();

        res.json({ message: "Connection removed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.rejectConnectionRequest = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // The user rejecting the request

        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove the request from pendingRequests
        user.pendingRequests = user.pendingRequests.filter(id => id.toString() !== req.params.id);
        await user.save();

        res.json({ message: "Connection request rejected" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};




