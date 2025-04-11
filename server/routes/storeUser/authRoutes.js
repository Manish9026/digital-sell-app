import express from 'express'

import { Auth } from '../../controllers/storeUser/authController.js';
import { verifyUser } from '../../middlewares/storeUser/verifyUser.js';
const router=express.Router();


router.post('/login',Auth.loginUser);
router.post('/register',Auth.registerUser);
router.get('/verify',verifyUser)
router.get('/logout',Auth.logoutUser)
 

export default router