
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
  '/upload-course',
  upload.fields([
    { name: 'thumbnails', maxCount: 10 },
    { name: 'files', maxCount: 20 },
  ]),
 DriveController.uploadOnDrive
);

export default driveOpDashboard;
