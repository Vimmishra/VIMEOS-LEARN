const express = require("express");
const { generateCertificate } = require("../controllers/certificateController");

const router = express.Router();

router.get("/:userId/:courseId", generateCertificate);

module.exports = router;
