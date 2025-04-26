const User = require('../../models/User');

const searchStudent = async (req, res) => {
    try {

        const { keyword } = req.params
        if (!keyword || typeof keyword !== "string") {
            return res.status(400).json({
                success: false,
                message: "keyword must be string"
            })
        }

        const regEx = new RegExp(keyword, "i")

        const createSearchQuery = {
            $or: [
                { userName: regEx },
                { courseName: regEx },

            ]
        }

        const searchResults = await User.find(createSearchQuery);
        res.status(200).json({
            success: true,
            data: searchResults,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "could not find course!"
        })
    }
}

module.exports = { searchStudent };