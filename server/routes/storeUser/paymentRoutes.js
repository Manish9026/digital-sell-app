import express from 'express';
import { paymentController } from '../../controllers/storeUser/paymentController.js';
import { verifyUser } from '../../middlewares/storeUser/verifyUser.js';
const paymentRoutes = express.Router();
// import { createPayment, verifyPayment } from '../controllers/paymentController.js'
// paymentController
paymentRoutes.post("/create-order",verifyUser, paymentController.createPayment);
paymentRoutes.post("/verify-order", paymentController.verifyPayment);

export default paymentRoutes