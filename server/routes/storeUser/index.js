import express from 'express';
import userAuthRoutes from './authRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import { CartController } from '../../controllers/storeUser/cartController.js';
import { verifyUser } from '../../middlewares/storeUser/verifyUser.js';

const storeUserRoutes= express.Router();

storeUserRoutes.use("/auth",userAuthRoutes );
// storeUserRoutes.use("/product",)
storeUserRoutes.use("/payment",paymentRoutes)

// user cart routes 
storeUserRoutes.post("/cart/add",verifyUser,CartController.addToCart)
storeUserRoutes.get("/cart/fetch",verifyUser,CartController.getCart)
storeUserRoutes.post("/cart/remove",verifyUser,CartController.removeFromCart)




export default storeUserRoutes;