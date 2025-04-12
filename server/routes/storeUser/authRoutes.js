import express from 'express'

import { Auth } from '../../controllers/storeUser/authController.js';
import { verifyUser } from '../../middlewares/storeUser/verifyUser.js';
const router=express.Router();


router.post('/login',Auth.loginUser);
router.post('/register',Auth.registerUser);
router.get('/refresh-token',Auth.refreshToken)
router.get('/verify',verifyUser,Auth.verifyUser)
router.post('/logout',Auth.logoutUser)
 

export default router