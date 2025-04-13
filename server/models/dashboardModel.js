import { connectDashboardDB } from "../DBconfig/DB.config.js";
import mongoose from "mongoose";

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
      require: true, alias: "_id"
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
