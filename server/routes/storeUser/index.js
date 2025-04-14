import express from 'express';
import userAuthRoutes from './authRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const storeUserRoutes= express.Router();

storeUserRoutes.use("/auth",userAuthRoutes );
// storeUserRoutes.use("/product",)
storeUserRoutes.use("/payment",paymentRoutes)

export default storeUserRoutes;