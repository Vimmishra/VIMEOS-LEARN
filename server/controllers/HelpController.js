const Help = require("../models/Help");

const createHelp = async (req, res) => {
    try {

        const { name, email, issue } = req.body;

        if (!name || !email || !issue) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newHelp = new Help({ name, email, issue });
        const savedHelp = await newHelp.save();

        res.status(201).json(savedHelp);

    }

    catch (error) {
        console.error("Error creating help request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const getAllHelps = async (req, res) => {
    try {

        const help = await Help.find().sort({ createdAt: -1 });

        res.status(200).json(help);

    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}





const deleteHelpRequest = async (req, res) => {
    try {
        const { email } = req.params;

        const deletedHelp = await Help.findOneAndDelete({ email });

        if (!deletedHelp) {
            return res.status(404).json({ message: "Help request not found" });
        }

        res.status(200).json({ message: "Help request deleted successfully" });
    } catch (error) {
        console.error("Error deleting help request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { createHelp, getAllHelps, deleteHelpRequest };