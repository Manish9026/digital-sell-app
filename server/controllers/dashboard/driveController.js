// import auth 

import {auth} from '../../server.js'


import path from 'path';
import fs from 'fs';
import { GoogleApis ,google} from 'googleapis';
import mime from 'mime-types';
import { courseModel } from '../../models/dashboardModel.js';

const getDriveService =async () => {
const SCOPE = "https://www.googleapis.com/auth/drive";
//  const auth = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET_KEY, process.env.REDIRECT_URL);
// auth.setCredentials({ refresh_token: process.env.REFRESH_TOKEN,scope: SCOPE });

return   google.drive({ version: 'v3', auth });
}


//  const drive = google.drive({ version: 'v3', auth });



export class DriveController  {
  constructor(driveService) {
    this.drive = driveService;
  }


  static createCourseFolder = async (courseName) => {
    const drive = await getDriveService();
    const folderMetadata = {
      name: courseName,
      mimeType: 'application/vnd.google-apps.folder',
    };
  
    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: 'id',
    });
  
    return folder.data.id;
  };
  static uploadSingleFile = async (filePath, fileName, folderId, isPublic = false) => {
    const drive = await getDriveService();
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };
  
    const media = {
      mimeType: mime.lookup(filePath), // auto-detect type
      body: fs.createReadStream(filePath),
    };
  
    const uploadedFile = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });
  
    const fileId = uploadedFile.data.id;
  
    if (isPublic) {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    }
  
    const result = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, webViewLink, webContentLink',
    });
  
    return {
      id: result.data.id,
      name: result.data.name,
      mimeType: result.data.mimeType,
      viewLink: result.data.webViewLink,
      downloadLink: `https://drive.google.com/uc?export=download&id=${result.data.id}`,
    };
  };
  static uploadOnDrive=  async (req, res) => {
    try {
      const { title, description, category, price } = req.body;

      // 1. Create Google Drive folder
      const folderId = await createCourseFolder(title);

      const thumbnails = [];
      const files = [];

      // 2. Upload thumbnails (public)
      if (req.files['thumbnails']) {
        for (const file of req.files['thumbnails']) {
          const meta = await uploadSingleFile(file.path, file.originalname, folderId, true);
          thumbnails.push(meta);
          fs.unlinkSync(file.path);
        }
      }

      // 3. Upload course files (private)
      if (req.files['files']) {
        for (const file of req.files['files']) {
          const meta = await uploadSingleFile(file.path, file.originalname, folderId, false);
          files.push(meta);
          fs.unlinkSync(file.path);
        }
      }

      // 4. Save to DB
      const newCourse = await Course.create({
        title,
        description,
        category,
        price,
        folderId,
        thumbnails,
        files,
        // instructor: req.user._id  // Add if using auth
      });

      res.status(201).json({ success: true, course: newCourse });
    } catch (err) {
      console.error('Error creating course:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  async getDriveData(req, res) {
    try {
      const driveData = await this.driveService.getDriveData();
      res.status(200).json(driveData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch drive data' });
    }
  }
}