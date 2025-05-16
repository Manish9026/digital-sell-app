import express from 'express';
const AuthRoutes = express.Router();

import  AuthController  from '../../controllers/dashboard/authController.js';
import verifyAdminToken from '../../middlewares/dashboard/adminVerify.js';
 
AuthRoutes.post("/login", AuthController.adminLogin);
AuthRoutes.post("/verify-2fa", AuthController.verify2FA);
AuthRoutes.get("/verify-token", verifyAdminToken, AuthController.verifyToken);
AuthRoutes.get("/refresh-token", AuthController.refreshToken);
AuthRoutes.get("/logout",AuthController.logout);
// AuthRoutes.post("/forgot-password", AuthController.forgotPassword);
// AuthRoutes.post("/reset-password", AuthController.resetPassword);
// AuthRoutes.post("/enable-2fa", verifyAdminToken, AuthController.enable2FA);
// AuthRoutes.post("/disable-2fa", verifyAdminToken, AuthController.disable2FA);

export default AuthRoutes;
