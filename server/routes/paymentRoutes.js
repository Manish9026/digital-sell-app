import express from 'express';
import { paymentController } from '../controllers/paymentController.js';
const router =express.Router();
// import { createPayment, verifyPayment } from '../controllers/paymentController.js'
// paymentController
router.post("/create-order",paymentController.createPayment);
router.post("/verify-order",paymentController.verifyPayment);

export default router