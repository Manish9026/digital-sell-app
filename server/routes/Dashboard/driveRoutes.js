
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import express from 'express';
import { google } from 'googleapis';
import { DriveController } from '../../controllers/dashboard/driveController.js';
import { auth } from '../../server.js';

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

export default driveOpDashboard;
