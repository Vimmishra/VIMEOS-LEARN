const express = require('express');
const { registerUser, loginUser, sendOtp, verifyOtp, resetPassword } = require('../../controllers/auth-controller');
const router = express.Router();
const authenticateMiddleware = require('../../middleware/auth-middleware')

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get('/check-auth', authenticateMiddleware, (req, res) => {
    const user = req.user
    res.status(200).json({
        success: true,
        message: 'Authenticated user!',
        data: {
            user
        }
    })
})










//otp:
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);





module.exports = router;