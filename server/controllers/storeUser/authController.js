
import formidable from 'formidable'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { generateToken } from '../../utils/genrateToken.js';
import { storeUserModel } from '../../models/authModel.js';
import { badResponse, goodResponse } from '../../utils/response.js';







export class Auth  {

    static registerUser = async (req, res) => {
        const { firstName, lastName, userEmail, password } = req.body;
      
        try {
            if(!(firstName || lastName || userEmail || password)) {
                return badResponse({res,message:"All fields are required"})
            }
          const existingUser = await User.findOne({ userEmail });
          if (existingUser) {
            return badResponse({res,status:409,message:"Email already in use"}) 
          }
      
          const hashedPassword = await bcrypt.hash(password, 10);
      
          const newUser = await User.create({
            firstName,
            lastName,
            userEmail,
            password: hashedPassword,
          });
      
          goodResponse({res,statusCode:201,message:"User created successfully",data:newUser})
        //   res.status(201).json({ message: "User registered", userId: newUser._id });
        } catch (error) {
            badResponse({res,statusCode:500,message:"Server error",error:error.message})
        }
      };
    static loginUser = async (req, res) => {
        const { userEmail, password } = req.body;
      
        if(!(userEmail || password))
            return res.status(400).json({ message: "Email and password are required" });

        const user = await storeUserModel.findOne({ userEmail });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
      
        const accessToken = generateToken({userId:user._id, userRole:user.role}, "15m");
        const refreshToken =generateToken({userId:user._id, userRole:user.role}, "7d");
      
        // Get IP and user agent
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
      
        // Store refresh token as session
        user.sessions.push({ token: refreshToken, ip, userAgent });
        await user.save();
      
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
      
        res.status(200).json({ message: "Login successful" });
      };
    static refreshToken = async (req, res) => {
  const token = req?.cookies?.refreshToken;
  const ip = req?.ip;
  const userAgent = req.headers['user-agent'];

  if (!token) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await storeUserModel.findById(decoded.id);

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
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
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
  
    res.status(200).json({ message: "Logged out successfully" });
  };
  
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