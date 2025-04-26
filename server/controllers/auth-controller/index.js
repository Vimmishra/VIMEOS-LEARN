const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");


const registerUser = async (req, res) => {
    const { userName, userEmail, password, role } = req.body;

    const existingUser = await User.findOne({
        $or: [{ userEmail }, { userName }],
    });
    if (existingUser) {
        return res.status(200).json({
            success: false,
            message: "UserName or Email Already exists!"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, userEmail, password: hashPassword, role })

    await newUser.save();

    return res.status(201).json({
        success: true,
        message: "User Registered successfully!"
    })
};




const loginUser = async (req, res) => {
    const { userEmail, password } = req.body;

    const checkUser = await User.findOne({ userEmail });

    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
        return res.status(201).json({
            success: false,
            message: "invalid Credentials!"
        })
    }

    const accessToken = jwt.sign({
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role
    }, 'JWT_SECRET', { expiresIn: '2h' })


    res.status(200).json({
        success: true,
        message: "Logged in successfully!",
        data: {
            accessToken,
            user: {
                _id: checkUser._id,
                userName: checkUser.userName,
                userEmail: checkUser.userEmail,
                role: checkUser.role
            }
        }
    })


};



//otp
let otpStore = {};

const sendOtp = async (req, res) => {
    console.log("Received Request at /send-otp", req.body);
    const { userEmail } = req.body;

    if (!userEmail) {

        return res.status(400).json({ success: false, message: "Email is required!" });
    }

    try {
        const user = await User.findOne({ userEmail });

        if (!user) {
            console.log("❌ User not found in database");
            return res.status(400).json({ success: false, message: "User not found!" });
        }


        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[userEmail] = otp;



        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });




        setTimeout(() => delete otpStore[userEmail], 3 * 60 * 1000);

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Password Reset OTP for Vimeos Learn",
            text: `Your OTP for password reset is: ${otp}`,
        });

        console.log("✅ OTP email sent successfully!");
        res.json({ success: true, message: "OTP sent successfully!" });

    } catch (error) {
        console.error("❌ Error in sendOtp:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




const verifiedUsers = {};

const verifyOtp = (req, res) => {
    const { userEmail, otp } = req.body;

    if (!userEmail || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required!" });
    }

    console.log(`🔵 Received OTP verification request for ${userEmail} with OTP: ${otp}`);

    if (otpStore[userEmail] === otp) {
        verifiedUsers[userEmail] = true;
        delete otpStore[userEmail];

        return res.json({ success: true, message: "OTP verified!" });
    } else {

        return res.status(400).json({ success: false, message: "Invalid OTP!" });
    }
};




// Reset Password
const resetPassword = async (req, res) => {
    const { userEmail, newPassword } = req.body;

    console.log("🟢 Received at /reset-password:", { userEmail, newPassword });
    console.log("🟢 Verified Users before reset:", verifiedUsers);

    if (!verifiedUsers[userEmail]) {
        console.log("❌ OTP not verified for:", userEmail);
        return res.status(400).json({ success: false, message: "OTP not verified!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ userEmail }, { password: hashedPassword });

    delete verifiedUsers[userEmail]; // ✅ Remove after reset

    console.log("✅ Password Reset for:", userEmail);
    console.log("🟢 Verified Users after reset:", verifiedUsers);

    return res.json({ success: true, message: "Password reset successfully!" });
};




module.exports = { registerUser, loginUser, sendOtp, verifyOtp, resetPassword };