const express = require('express');
const { capturePaymentAndFinalizeOrder, createOrder } = require('../../controllers/student-controller/order-controller');

const router = express.Router();

router.post('/create', createOrder)
router.post('/capture', capturePaymentAndFinalizeOrder)

module.exports = router;