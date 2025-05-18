
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { AdminUser } from "../../models/dashboardModel.js";
// AdminUser.createIndexes({ email: 1 }, { unique: true });
import mongoose from "mongoose";


export const createAccessToken = (data) => jwt.sign(data, process.env.ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
export const createRefreshToken = (data) => jwt.sign(data, process.env.ADMIN_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
export const badResponse = ({
  res,
  statusCode = 400,
  status = false,
  message = "Something went wrong",
  error = {},
  isAuthenticated = false,
} = {}) => {
  if (!res) {
    throw new Error("Response object (res) is required");
  }

  return res.status(statusCode).json({
    status,
    statusCode,
    message,
    error,
    isAuthenticated :false,
  });
};

export const goodResponse = ({
  res,
  statusCode = 200,
  status = true,
  message = "Successful",
  data = {},
  extra = {}
} = {}) => {
  if (!res) {
    throw new Error("Response object (res) is required");
  }

  return res.status(statusCode).json({
    status,
    statusCode,
    message,
    ...data,
    isAuthenticated: true,
    ...extra // optional for future use like pagination, meta, etc.
  });
};


// Login - Step 1 (Password Check)


// Login - Step 2 (Verify TOTP)
 class Auth {

    static adminLogin = async (req, res) => {
        const { email, password } = req.body;
        console.log(email, password); 
        
        const admin = await AdminUser.findOne({ email });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return badResponse({ res, statusCode: 401, message: "Invalid credentials" });
            
        }
        if (admin.twoFA.enabled) {
            const tempToken = jwt.sign({ id: admin._id }, process.env.ADMIN_TEMP_TOKEN_SECRET, { expiresIn: "5m" });
            res.cookie("tempToken", tempToken, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 5, sameSite: "None" });

            return goodResponse({ res, statusCode: 201, message: "2FA required", data:{need_2fa: true}  });
        }
        // No 2FA: login fully
        const newId = new mongoose.Types.ObjectId().toHexString();
        // console.log(newId.toHexString());
        
        const accessToken = createAccessToken({id: admin._id,sessionId: newId});
            const refreshToken = createRefreshToken({ id: admin._id, sessionId: newId });
            const hash = await bcrypt.hash(refreshToken, 10);
        // admin.sessions.push({id:newId, refreshTokenHash: hash, ip: req.ip, userAgent: req.headers['user-agent'] });
         await AdminUser.findOneAndUpdate({_id:admin._id}, {
      $push: {
        sessions: {
          id: newId,
        refreshTokenHash:hash,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          lastUsed: new Date()
        }
      }
    });
        // await admin.save(); 
        
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 1000 * 60 * 15, domain: '.vercel.app', });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "None" , maxAge: 1000 * 60 * 60 * 24 * 7 });

        return goodResponse({ res, statusCode: 201, message: "Login successful", data:{isAuthenticated:true,admin} });
    }
    static verify2FA = async (req, res) => {
        const { token } = req.body;
        const {admin:user}=req;

        console.log(token);
        


        // const decoded = jwt.verify(tempToken, "TEMP_SECRET");
        const admin = await AdminUser.findById(user._id);
        console.log(admin.twoFA.secret);
        
        const isVerified = speakeasy.totp.verify({
            secret: admin.twoFA.secret,
            encoding: "base32",
            token
        });
        console.log(isVerified);
        
        if (!isVerified) return res.status(401).json({ message: "Invalid TOTP" });

         // No 2FA: login fully
        const newId = new mongoose.Types.ObjectId().toHexString();
        // console.log(newId.toHexString());
        
        const accessToken = createAccessToken({id: admin._id,sessionId: newId});
            const refreshToken = createRefreshToken({ id: admin._id, sessionId: newId });
            const hash = await bcrypt.hash(refreshToken, 10);
        // admin.sessions.push({id:newId, refreshTokenHash: hash, ip: req.ip, userAgent: req.headers['user-agent'] });
         await AdminUser.findOneAndUpdate({_id:admin._id}, {
      $push: {
        sessions: {
          id: newId,
        refreshTokenHash:hash,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          lastUsed: new Date()
        }
      }
    });
       
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 1000 * 60 * 15, domain: '.vercel.app', });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "None" , maxAge: 1000 * 60 * 60 * 24 * 7 });

        return  goodResponse({ res, statusCode: 201, message: "You have been successfully authenticated.", data:{isAuthenticated:true,admin} });
        
       
    }
    static verifyToken = async (req, res) => {
        try {
            const {decoded,admin,twoFactorAuth} = req;
            // const {user}=req;
console.log(decoded);


            if(!admin) return badResponse({res,statusCode:401,message:"Unauthorized",});
              

            if(twoFactorAuth) return goodResponse({res,statusCode:201,message:"2FA required",data:{need_2fa:true,}});

            return goodResponse({res,statusCode:200,message:"Token verified",data:{admin}});


            
        } catch (error) {        
          return badResponse({res,statusCode:500,message:"internal server error",error});
        }
    }

    static refreshToken= async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    console.log(token);
     
    if (!token) return res.status(401).json({ message: "No refresh token" });
 
    // 1. Verify refresh token
    const decoded = jwt.verify(token, process.env.ADMIN_REFRESH_TOKEN_SECRET);
    const { id, sessionId } = decoded;

    if(!id || !sessionId) return res.status(401).json({ message: "Invalid token owner" });
    console.log(sessionId,id);
    

    // 2. Find admin by ID
    const admin = await AdminUser.findById(id);
    if (!admin) return res.status(401).json({ message: "Invalid token owner" });

    // 3. Find the matching session
    const session = admin.sessions.find(s => s?.id?.toString() === sessionId);
    if (!session) return res.status(403).json({ message: "Session not found" });
 
    // console.log("ip",req.ip,session.ip);
    // console.log("agent",req.headers['user-agent'],session?.userAgent)
// viladate device session using ip
    if(session?.ip !== req.ip) return res.status(403).json({ message: "IP mismatch" });
    if(session?.userAgent !== req.headers['user-agent']) return res.status(403).json({ message: "User agent mismatch" });
    
    // 4. Compare hashed token
    const isValid = await bcrypt.compare(token, session.refreshTokenHash);
    if (!isValid) return res.status(403).json({ message: "Invalid token" });

    // 5. Rotate refresh token
    const newSessionId = new mongoose.Types.ObjectId().toHexString();
    const newRefreshToken = createRefreshToken({ id: admin._id, sessionId: newSessionId });
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    const newAccessToken = createAccessToken({ id: admin._id, sessionId: newSessionId });

    // 6. Update session: remove old, insert new
    admin.sessions = admin.sessions.filter(s => s.id !== sessionId);
    admin.sessions.push({
      id: newSessionId,
      refreshTokenHash: newRefreshTokenHash,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      lastUsed: new Date()
    });

    await admin.save();

    // 7. Send tokens
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    res.status(201).json({ accessToken: newAccessToken ,message:"Token refreshed"});

  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};  

    static logout = async (req, res) => {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token" });
        const decoded = jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_SECRET);
        const { id, sessionId } = decoded;
        if (!id || !sessionId) return res.status(401).json({ message: "Invalid token owner" });
        const admin = await AdminUser.findById(id);
        if (!admin) return res.status(401).json({ message: "Invalid token owner" });
        admin.sessions = admin.sessions.filter(s => s?.id?.toString() !== sessionId);
        await admin.save();
        res.clearCookie("refreshToken",{ httpOnly: true, secure: true, sameSite: "None" });
        res.clearCookie("accessToken",{ httpOnly: true, secure: true, sameSite: "None" });
        // res.json({ message: "Logged out successfully" });
        return goodResponse({ res, statusCode: 200, message: "Logged out successfully" });
    }

    // setup 2FA and generate QR code and confirm 2FA
    static setup2FA = async (req, res) => {

      const {admin}=req;
        // const { email } = req.body;
        // const admin = await AdminUser.findOne({ email });
        const secret = speakeasy.generateSecret({ name: "Admin Dashboard" });
        qrcode.toDataURL(secret.otpauth_url, async (err, image_data) => {
            if (err) return res.status(500).json({ message: "QR generation failed" });
            admin.twoFA.secret = secret.base32;
            await admin.save();
            res.json({ qr: image_data, secret: secret.base32 });
        });
    };
    static confirm2FA = async (req, res) => {
        const {token, secret } = req.body;
        const {admin}=req;

        if(admin && admin?.twoFA.enabled)
          return badResponse({res,message:"Already enabled 2FA. "})
        const isVerified = speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token
        });
        if (!isVerified) return badResponse({res,statusCode:400,message:"Invalid TOTP code"})
        const updateAdmin = await AdminUser.findOne({ _id:admin });
        updateAdmin.twoFA.enabled = true;
        updateAdmin.twoFA.secret = secret;
        await updateAdmin.save();

        return goodResponse({res,message:"2FA enabled" ,data:{admin:updateAdmin}})
        // res.json({ message: "2FA enabled",admin });
    }

    static disabled2FA=async(req,res)=>{
      try {
        
        const {admin}=req;
        if(!admin) return badResponse({res,message:"try after some time",statusCode:400})
        
          const updatedAdmin=await AdminUser.findById(admin?._id);
          updatedAdmin.twoFA.enabled=false;
          updatedAdmin.twoFA.secret="";
          await updatedAdmin.save()

          return goodResponse({res,message:"Disabled 2FA.",data:{admin:updatedAdmin}})
          
      } catch (error) {  
        console.log(error);
          
       return badResponse({res,message:"server error",statusCode:500})
      }
    }

}

export default Auth;