// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
import { storeUserModel } from "../../models/authModel.js";
import { badResponse } from "../../utils/response.js";
// import { error } from "server/router";
export const verifyUser = async(req, res, next) => {
  const token = req.cookies.accessToken;
  console.log("token",token);
  
  if (!token) return badResponse({res,statusCode:401,message:" Unauthorized"}) 
   

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user=await storeUserModel.findById(decoded?.userId).select("-password -sessions -__v") 
    if(!user) return badResponse({res,statusCode:401,message:" Unauthorized"}) 
    req.user = user; // Attach user info to request
    next();
  } catch (err) {
    console.log(err);
    
    res.status(403).json({ message: "Invalid access token" });
  }
};
