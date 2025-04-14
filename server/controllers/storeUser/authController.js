
import formidable from 'formidable'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { generateToken } from '../../utils/genrateToken.js';
import { storeUserModel } from '../../models/authModel.js';
import { badResponse, goodResponse } from '../../utils/response.js';







export class Auth  {

    static registerUser = async (req, res) => {
        const { firstName, lastName, email:userEmail, password } = req.body;
      console.log("register",req.body);
      
        try {
            if(!(firstName || lastName || userEmail || password)) {
                return badResponse({res,message:"All fields are required"})
            }
          const existingUser = await storeUserModel.findOne({ userEmail });
          if (existingUser) {
            return badResponse({res,statusCode:409,message:"Email already in use"}) 
          }
      
          const hashedPassword = await bcrypt.hash(password, 10);
      
          const newUser = await storeUserModel.create({
            firstName,
            lastName,
            userEmail,
            password: hashedPassword,
          });
      
          goodResponse({res,statusCode:201,message:"Successfully registered",data:newUser})
        //   res.status(201).json({ message: "User registered", userId: newUser._id });
        } catch (error) {
          console.log(error);
          
            badResponse({res,statusCode:500,message:"Server error",error:error.message})
            
        }
      };
    static loginUser = async (req, res) => {

      try {
      

        const { email:userEmail, password } = req.body;
        console.log("login,",req.body,"");
      
        if(!(userEmail || password))
            return badResponse({res,message:"All fields are required",statusCode:400})
         

        const user = await storeUserModel.findOne({ userEmail });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return badResponse({res,message:"Please fill valid credential",statusCode:400}) 
          
        }
      
        const accessToken = generateToken({userId:user._id, userRole:user.role}, "30m");
        const refreshToken =generateToken({userId:user._id, userRole:user.role}, "7d");
      
        // Get IP and user agent
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
      
        // Store refresh token as session
        user.sessions.push({ token: refreshToken, ip, userAgent });
        const newUser=await user.save();

        const { password:hidePassword, ...insensitiveData } = newUser.toObject()
      
      
        
        // Send cookies
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000,
        });
      
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      
        return goodResponse({res,statusCode:200,message:"User verified",data:{isAuthenticated:true,user:insensitiveData}})
      } catch (error) {
        console.log(error);

            badResponse({res,statusCode:500,message:"Server error",error:error.message})
        
      }
      };
    static refreshToken = async (req, res) => {
  const token = req?.cookies?.refreshToken;
  const ip = req?.ip;
  const userAgent = req.headers['user-agent'];
console.log(token,ip,userAgent);

  if (!token) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    if(!decoded) 
    return res.status(403).json({ message: "Invalid or expired refresh token" });
    const user = await storeUserModel.findById(decoded?.userId);

    const session = user.sessions.find(
      (s) => s.token === token && s.ip === ip && s.userAgent === userAgent
    );

    if (!session) {
      return res.status(403).json({ message: "Session not found or device mismatch" });
    }

    // Rotate tokens
    // const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id, user.role);
    const accessToken = generateToken({userId:user._id, userRole:user.role}, "15m");
    const newRefreshToken =generateToken({userId:user._id, userRole:user.role}, "7d");
    // Remove old session, add new one
    user.sessions = user.sessions.filter((s) => s.token !== token);
    user.sessions.push({ token: newRefreshToken, ip, userAgent });
    await user.save();

    // Set new cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Token refreshed" });
  } catch (err) {

    console.log(err);
    
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

    static logoutUser = async (req, res) => {
    const token = req.cookies.refreshToken;
    const user = await storeUserModel.findOne({ "sessions.token": token });
  
    if (user) {
      user.sessions = user.sessions.filter((s) => s.token !== token);
      await user.save();
    }
  
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  
    goodResponse({res,statusCode:200,message:"Logged out successfully",data:{isAuthenticated:false}})
    // res.status(200).json({ message: "Logged out successfully" });
  };
  static verifyUser = async (req, res) => {
    try {
      const {user}=req;
      console.log("verify user");
      
      if (!user) {
        return badResponse({res,statusCode:401,message:"Unauthorized",data:{isAuthenticated:false}})
      }

      return goodResponse({res,statusCode:200,message:"User verified",data:{isAuthenticated:true,user}})
      
    } catch (error) {
      console.log(error);
      
      return badResponse({res,statusCode:500,message:"Server error",error:error.message})
    }
  }
  
    static logout = async (req, res) => {
        try {

            res.clearCookie('uid', {
                sameSite: process.env.DEPLOYMENT_TYPE == "local" ? 'Strict' : "None",
                secure: process.env.DEPLOYMENT_TYPE == "local" ? false : true,
                httpOnly: process.env.DEPLOYMENT_TYPE == "local" ? false : true,
            });

            res.send({
                message: "logout successfully",
                status: true
            })


        } catch (error) {

        }
    }
}