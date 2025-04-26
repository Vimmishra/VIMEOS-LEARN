const express = require("express");

const mongoose = require("mongoose");

const User = require("../models/User")


const authenticate = require("../middleware/auth-middleware");
const { getAllUsers, sendConnectionRequest, acceptConnectionRequest,
    getAuthenticatedUser, getUserById, getConnections, rejectConnectionRequest,
    removeConnection, } = require("../controllers/usercontroller");


const router = express.Router();

router.get("/", getAllUsers); // Get all students
router.post("/connect/:id", authenticate, sendConnectionRequest); // Send request
router.post("/accept/:id", authenticate, acceptConnectionRequest); // Accept request


//reject
router.post("/reject/:id", authenticate, rejectConnectionRequest); // <-- Added
router.post("/remove/:id", authenticate, removeConnection);


router.get("/:id", getUserById); // Get user by ID





module.exports = router;
