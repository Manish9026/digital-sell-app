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
  location:Object,
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
  sessions: [sessionSchema],
  adminDrives: 
  { 
      type: [mongoose.Schema.Types.ObjectId],
      ref: "adminDrives",
      required: true
  }

},);


const driveSchema=new mongoose.Schema({
  adminId:mongoose.Types.ObjectId,
  email: { type: String, required: true, unique: true },
  details:Object,
  accessToken:String,
  refreshToken:String,
  expiryDate:Date,
  isAccess:{
    type:Boolean,
    default:true
  },

})

export const driveModel=connectDashboardDB.model("adminDrives",driveSchema);
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
    category: {
       name:String,
       id:{
        type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
       }  
    },
    tags: [String],
    price: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    actualPrice:{ type: Number, default: 0 },
    coupons: [
      {
        name:{
          type:String,
          index:true
        },
        id:{
          type:mongoose.Types.ObjectId,
          ref:"coupens"
        }

      }
    ],

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

// models/Category.ts
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
    },
    description: String,
    icon: String, // optional icon for UI
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  { timestamps: true }
);
export const categoryModel= connectDashboardDB.model('Category', CategorySchema);

// coupen schema 

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'digital-product',
      },
    ], // Empty = global coupon
    usageLimit: Number,
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    expiresAt: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const couponModel=connectDashboardDB.model("coupens",couponSchema);

productSchema.index({ title: 'text', description: 'text', tags: 'text' });
export const productModel = connectDashboardDB.model('digital-product', productSchema);
