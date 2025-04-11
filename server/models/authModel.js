import mongoose from "mongoose";


const storeUserSchema = mongoose.Schema({

    firstName:String,
    lastName:String,
    userEmail: {
        type: String,
        required: true,
        unique:true,
        index: true,
    },
    password: {
        type: String
    },
    role:{
        type:String,

    },

    current_location: {
        type: Object
    },
    userSetting:{
        type:mongoose.Types.ObjectId,
        ref:"userSetting",
    },
    refreshToken:String
})

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