const authenticate = require("../middleware/auth-middleware");
const express = require("express");

const { createHelp, getAllHelps, deleteHelpRequest } = require("../controllers/HelpController"); // Ensure correct path

const router = express.Router();

router.post("/", authenticate, createHelp);

router.get("/", getAllHelps);

router.delete("/:email", deleteHelpRequest);

module.exports = router;