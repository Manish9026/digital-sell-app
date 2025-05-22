
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import express from 'express';
import { google } from 'googleapis';
import { DriveController } from '../../controllers/dashboard/driveController.js';
// import { auth } from '../../server.js';
import { googleAuth } from '../../DBconfig/googleClient.js';
import verifyAdminToken from '../../middlewares/dashboard/adminVerify.js';
const driveOpDashboard = express.Router();
// const Drive = new DriveController(google.drive({ version: 'v3', auth }));

const upload = multer({ dest: 'uploads/' });
DriveController
driveOpDashboard.post(
  '/upload-products',
  upload.fields([
    { name: 'thumbnails', maxCount: 10 },
    { name: 'files', maxCount: 20 },
  ]),
 DriveController.uploadOnDrive
);

driveOpDashboard.get('/files/:fileId/view', async (req, res) => {
  const fileId = req.params.fileId;
  const user = req.user; // Comes from middleware

  try {
    // Optional: check if user purchased course that contains this file
    const hasPurchased = true; // You implement your logic here
    if (!hasPurchased) return res.status(403).json({ message: 'Not authorized' });

    const driveRes = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    // Set appropriate headers for image
    res.setHeader('Content-Type', 'image/jpeg'); // or detect dynamically
    driveRes.data.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch image', error: error.message });
  }
});

driveOpDashboard.get('/category',DriveController.getCategory)

/*--------------------------------- drive Auth && setup routes -----------------------*/
driveOpDashboard.post("/auth/google", verifyAdminToken, (req, res) => {
    const {admin}=req
    const url = googleAuth.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/userinfo.email"],
        prompt: "consent",
        state: JSON.stringify({ adminId:admin?._id})
    });

    // DriveController.saveToken("manishmaurya11365@gmail.com", {
    //     access_token: "accesstoken",
    //     refresh_token: "refreshToken",
    //     expiry_date: new Date(),
    // })
    return res.status(201).json({url})
})

driveOpDashboard.get("/oauth2callback", async (req, res) => {

    try {
        const { code,state  } = req.query;
        const { adminId } = JSON.parse(state);
        const { tokens } = await googleAuth.getToken(code);
        console.log(tokens, code);
        googleAuth.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: "v2", auth: googleAuth });
        const { data } = await oauth2.userinfo.get();
        console.log(data.email, tokens);
        DriveController.saveToken(data.email, tokens,adminId)

        // res.send("Google account connected!");
        res.redirect(`${process.env.BASE_URL}/dashboard/setting/drive-setup`)
    } catch (error) {
        res.redirect(`${process.env.BASE_URL}/dashboard/setting/drive-setup`)
        console.log("server error:", error);

    }
});

driveOpDashboard.get("/get-drives",verifyAdminToken,DriveController.getDriveData)
export default driveOpDashboard;
