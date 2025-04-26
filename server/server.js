
//new

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// Import Routes
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const courseSearchRoutes = require("./routes/student-routes/search-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const postRoutes = require("./routes/postRoutes");
const studentRoutes = require("./routes/studentRoutes");
const imageRoutes = require("./routes/imageRoutes");
const helpRoutes = require("./routes/helpRoutes");


const quizRoutes = require('./routes/quizRoutes');




// Import Models
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || "*" } });

//io
app.set("io", io);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(console.error);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentOrderRoutes);
app.use("/api/coupons", require("./routes/student-routes/couponRoutes"));
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/search", courseSearchRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

app.use("/api/certificates", certificateRoutes);
app.use("/certificates", express.static("certificates"));
app.use("/api/posts", postRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/students", studentRoutes);
app.use("/api/admin", imageRoutes);
app.use("/api/help", helpRoutes);



app.use('/api/quiz', quizRoutes);


// 🔥 WebSocket (Socket.io) for Real-time Chat
io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // User joins a chat room
    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`👤 User ${userId} joined chat room`);
    });


    // Handle Sending Messages
    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
        try {
            // Save message to MongoDB
            const newMessage = new Message({ senderId, receiverId, message });
            await newMessage.save();

            // Emit message to the receiver's room
            io.to(receiverId).emit("receiveMessage", { senderId, message });
            console.log(`📩 Message sent from  ${senderId} to ${receiverId}`);
        } catch (error) {
            console.error("❌ Error saving message:", error);
        }
    });



    // Handle User Disconnect
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});


// Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(500).json({ success: false, message: "Something went wrong" });
});

// Start Server
server.listen(PORT, () => {
    console.log(`🚀 Server running on PORT: ${PORT}`);
});







/*
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// Import Routes
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const courseSearchRoutes = require("./routes/student-routes/search-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const certificateRoutes = require("./routes/certificateRoutes");


const postRoutes = require("./routes/postRoutes");






// Import Models
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || "*" } });

//io
app.set("io", io);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(console.error);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentOrderRoutes);
app.use("/api/coupons", require("./routes/student-routes/couponRoutes"));
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course/search", courseSearchRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

app.use("/api/certificates", certificateRoutes);
app.use("/certificates", express.static("certificates"));



app.use("/api/posts", postRoutes);



// 🔥 WebSocket (Socket.io) for Real-time Chat
io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // User joins a chat room
    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`👤 User ${userId} joined chat room`);
    });


    // Handle Sending Messages
    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
        try {
            // Save message to MongoDB
            const newMessage = new Message({ senderId, receiverId, message });
            await newMessage.save();

            // Emit message to the receiver's room
            io.to(receiverId).emit("receiveMessage", { senderId, message });
            console.log(`📩 Message sent from  ${senderId} to ${receiverId}`);
        } catch (error) {
            console.error("❌ Error saving message:", error);
        }
    });



    // Handle User Disconnect
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});


// Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(500).json({ success: false, message: "Something went wrong" });
});

// Start Server
server.listen(PORT, () => {
    console.log(`🚀 Server running on PORT: ${PORT}`);
});





*/


