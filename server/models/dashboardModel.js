import { connectDashboardDB } from "../DBconfig/DB.config.js";
import mongoose from "mongoose";

// course schema


const fileSchema = new mongoose.Schema({
  name: String,
  mimeType: String,
  driveFileId: String,
  viewLink: String,
  downloadLink: String,
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    price: { type: Number, required: true, default: 0 },

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

export const courseModel = connectDashboardDB.model('Course', courseSchema);
