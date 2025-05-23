// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
import { storeUserModel } from "../../models/authModel.js";
import { badResponse } from "../../utils/response.js";
// import { error } from "server/router";
export const verifyUser = async(req, res, next) => {
  const token = req.cookies.uAccessToken;
  console.log("token",token);

  const refreshToken=req.cookies.uRefreshToken;
  
  if (!token && !refreshToken) return badResponse({res,statusCode:401,message:" Unauthorized"}) 
   
    let decoded;
    let user;

  try {
    try {
       decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      try {
        decoded=jwt.verify(refreshToken,process.env.JWT_SECRET);
      } catch (err) {
        return badResponse({res,statusCode:401,message:" Unauthorized"}) 
      }
    }

    if(!decoded) return badResponse({res,statusCode:401,message:" Unauthorized token"})

     user=await storeUserModel.findById(decoded?.userId).select("-password -sessions -__v") 
    if(!user) return badResponse({res,statusCode:401,message:" Unauthorized"}) 
    req.user = user; // Attach user info to request
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid access token" });
  }
};
