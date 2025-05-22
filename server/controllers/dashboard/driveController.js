// import auth 

// import {auth} from '../../server.js'


import path from 'path';
import fs from 'fs';
import { GoogleApis ,google} from 'googleapis';
import mime from 'mime-types';
import { AdminUser, driveModel, productModel } from '../../models/dashboardModel.js';
import { badResponse, goodResponse } from '../../utils/response.js';
import { driveAccess } from '../shared.js';



let driveInstance = null;
let authClient = null;

export const getDriveService = async () => {
  if (driveInstance && authClient) {
    return driveInstance;
  }

  if (!authClient) {
    authClient = await driveAccess(); // returns OAuth2 client with refresh token
  }
("\n\n<--------------------count--------------------\n\n");
  driveInstance = google.drive({ version: "v3", auth: authClient });
  return driveInstance;
};


// const SCOPE = "https://www.googleapis.com/auth/drive";




//  const drive = google.drive({ version: 'v3', auth });



export class DriveController  {


  constructor(driveService) {
    this.drive = driveService;
  }

 

static saveToken = async (email, tokens,adminId) => {
  try {
  
    if(!adminId) throw {message:"Unauthorized access !!"}
  // const adminId="68271c1bf6ab803cc56396c1"
  if(!tokens) throw {message:"token not valied access !!"}
  const expiryDate= new Date(Date.now() + (Number(tokens?.refresh_token_expires_in)*1000))
  console.log("\n expireDate \n",expiryDate.toLocaleDateString());
  
 const storedData = await driveModel.findOneAndUpdate(
    { email, adminId }, // Lookup condition
    {
      $set: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate,
      },
      $setOnInsert: {
        email,
        adminId,
      }
    },
    {
      upsert: true,
      new: true,
    }
  );
  const newUser=await AdminUser.findByIdAndUpdate(adminId,{
   
    $addToSet: {
      adminDrives: storedData?._id,
    },
  
  },{upsert:true,new:true})
  return {admin:newUser}
  
  } catch (error) {
    console.log(error);
    
  }
};

static getToken = async (email,id) => {
  const drive= await AdminUser.findOne({ "adminDrives.drive.isPrimary":true,_id:id }).populate("adminDrives.drive");

  console.log(drive,"edirve");
  
  return 
};

static deleteToken = async (email,id) => {
  await Token.deleteOne({ email ,adminId:id});
};


  static createProductFolder = async (prdName) => {
    const drive = await getDriveService();
    const folderMetadata = {
      name: prdName,
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
      fields: 'id, name, mimeType, webViewLink, webContentLink,thumbnailLink',
    });
  
    return {
      id: result.data.id,
      name: result.data.name,
      mimeType: result.data.mimeType,
      viewLink: result.data.webViewLink,
   thumbnailLink:isPublic && result.data.thumbnailLink,
      downloadLink: `https://drive.google.com/uc?export=download&id=${result.data.id}`,
    };
  };
  static uploadOnDrive=  async (req, res) => {
    try {
      const { title, description, category, price ,discountPercent,discountPrice,actualPrice} = req.body;
console.log(title, description, category, price);

      // console.log('Request body:', req.body,name);
      // console.log('Files:', req.files);
      // return 
      
      // 1. Create Google Drive folder
      const folderId = await this.createProductFolder(title);

      const thumbnails = [];
      const files = [];

      // 2. Upload thumbnails (public)
      if (req.files['thumbnails']) {
        for (const file of req.files['thumbnails']) {
          const meta = await this.uploadSingleFile(file.path, file.originalname, folderId, true);
          thumbnails.push(meta);
          fs.unlinkSync(file.path);
        }
      }

      // 3. Upload course files (private)
      if (req.files['files']) {
        for (const file of req.files['files']) {
          const meta = await this.uploadSingleFile(file.path, file.originalname, folderId, false);
          files.push(meta);
          fs.unlinkSync(file.path);
        }
      }

      console.log('Thumbnails:', thumbnails);
      console.log('Files:', files);
      
      // 4. Save to DB
      const newProduct = await productModel.create({
        title,
        description,
        category,
        price,
        'folder.id': folderId,
        discountPercent,discountPrice,
        thumbnails,
        files,
        actualPrice
        // instructor: req.user._id  // Add if using auth
      });

      res.status(201).json({ success: true, product: newProduct });
    } catch (err) {
      console.error('Error creating course:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static getAllProducts=async(req,res)=>{
    try {
      const product=await productModel.find();
      if(product.length>0){
        return goodResponse({res,message:"record founded !!",data:{product},statusCode:200})
      }
      return badResponse({res,message:"no produsct are avalavial at this movement !!"})
    } catch (error) {
      return badResponse({res,statusCode:500,message:"sever error"})
    }
  }
  static getDriveData= async(req, res) =>{
    try {
      const {admin}=req;

      await  this.getToken("",admin?._id)
      if(!admin) return  badResponse({res,message:'Failed to fetch drive data',statusCode:403})
       const drives=await AdminUser.findById(admin?._id,{password:0,twoFA:0,sessions:0}).populate({
  path: "adminDrives",
});

      //  console.log(drives);
       return goodResponse({res,message:"record found!!",extra:{drives:drives?.adminDrives	|| []}})
    } catch (error) {
      badResponse({res,message:'Failed to fetch drive data',statusCode:500})
    }
  }
}