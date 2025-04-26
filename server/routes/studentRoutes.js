const express = require("express");
const router = express.Router();
const { getStudentProfile, updateStudentProfile, createStudentProfile, getAllStudents } = require("../controllers/studentController");

router.post("/", createStudentProfile);

router.get("/:userId", getStudentProfile);
router.put("/:userId", updateStudentProfile);


router.get("/", getAllStudents);



module.exports = router;
