import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({
    token: { type: String, required: true },
    ip: String,
    userAgent: String,
    createdAt: { type: Date, default: Date.now },
  });
const storeUserSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    current_location: Object,
    userSetting: {
      type: mongoose.Types.ObjectId,
      ref: "userSetting",
    },
    sessions: [sessionSchema], 
    refreshToken: String,
  },{timestamps:true});

const adminUserSchema=mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique:true,
        index: true,
    },
    password: {
        type: String
    },
    // loginType:{

    // },
    role:{
        type:String,
    },
    refreshToken:String,
    accessToken:String,
})

export const adminUserModel=mongoose.model("adminUser",adminUserSchema)
export const storeUserModel = mongoose.model("storeUser", storeUserSchema);