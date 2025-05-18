// import { required } from "joi";
import { connectDashboardDB } from "../DBconfig/DB.config.js";
import mongoose from "mongoose";
// admin user schema 

const sessionSchema = new mongoose.Schema({
  id:{type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId,required: true,unique:true

  },
  refreshTokenHash: String,
  ip: String,
  userAgent: String,
  browser:String,
  device:String,
  os:String,
  createdAt: { type: Date, default: Date.now },
  lastUsed: Date
},{_id: false});

const adminUserSchema = new mongoose.Schema({
 email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: String,
  adminName: { type: String,  },
  profilePic: String,
  twoFA: {
    enabled: { type: Boolean, default: false },
    secret: String // TOTP secret
  },
  sessions: [sessionSchema]
});

export  const  AdminUser = connectDashboardDB.model("AdminUser", adminUserSchema);




// course schema


const fileSchema = new mongoose.Schema({
  id: {
    type: String, // Google Drive file ID
    required: true,
  },
  thumbnailLink: String,
  name: String,
  mimeType: String,
  driveFileId: String,
  viewLink: String,
  downloadLink: String,
});

const productSchema = new mongoose.Schema(
  {
    prdId: {
      type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId,
      require: true,
      index: true,
      unique: true,
  },
    title: { type: String, required: true },
    description: String,
    category: String,
    price: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    actualPrice:{ type: Number, default: 0 },
    couponCode: { type:[
      { code: String, discountPercentage: Number, expiryDate: Date }
    ] 
      , default: [] },

    paidUser:{
      type:[{
        userId:mongoose.Schema.Types.ObjectId,
        email:String,
      }],
      default: [],

      },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    folder: {
        name: String,
        id:{
            type: String, // Google Drive folder ID
            required: true,
            },
        } 
,

    thumbnails: [fileSchema], // Public
    files: [fileSchema],      // Private

    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const productModel = connectDashboardDB.model('digital-product', productSchema);
