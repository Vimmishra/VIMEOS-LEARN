
const express = require('express');
const { searchStudent } = require('../../controllers/student-controller/search-controller');

const router = express.Router()


router.get('/:keyword', searchStudent);




module.exports = router;