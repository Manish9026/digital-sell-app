
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { AdminUser } from "../../models/dashboardModel.js";
// AdminUser.createIndexes({ email: 1 }, { unique: true });
import mongoose from "mongoose";


export const createAccessToken = (data) => jwt.sign(data, process.env.ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
export const createRefreshToken = (data) => jwt.sign(data, process.env.ADMIN_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });


// Login - Step 1 (Password Check)


// Login - Step 2 (Verify TOTP)
 class Auth {

    static adminLogin = async (req, res) => {
        const { email, password } = req.body;
        console.log(email, password); 
        
        const admin = await AdminUser.findOne({ email });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (admin.twoFA.enabled) {
            const tempToken = jwt.sign({ id: admin._id }, process.env.ADMIN_TEMP_TOKEN_SECRET, { expiresIn: "15m" });
            res.cookie("tempToken", tempToken, { httpOnly: true, secure: true, sameSite: "strict" });
            return res.status(201).json({ need_2fa: true, tempToken });
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
        
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
        res.status(201).json({ accessToken });
    }
    static verify2FA = async (req, res) => {
        const { token, tempToken } = req.body;
        const decoded = jwt.verify(tempToken, "TEMP_SECRET");
        const admin = await AdminUser.findById(decoded.id);
        const isVerified = speakeasy.totp.verify({
            secret: admin.twoFA.secret,
            encoding: "base32",
            token
        });
        if (!isVerified) return res.status(401).json({ message: "Invalid TOTP" });

        const accessToken = createAccessToken(admin._id);
        const refreshToken = createRefreshToken(admin._id);
        const hash = await bcrypt.hash(refreshToken, 10);
        admin.sessions.push({ refreshTokenHash: hash, ip: req.ip, userAgent: req.headers['user-agent'] });
        await admin.save();
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
        res.json({ accessToken });
    }
    static verifyToken = async (req, res) => {
        try {
            const {decoded,admin,twoFactorAuth} = req;
            // const {user}=req;
console.log(decoded);


            if(!admin) return res.status(401).json({message:"Unauthorized"});

            if(twoFactorAuth) return res.status(403).json({message:"2FA required",need_2fa: true,});
            res.json({message:"Token verified",user:admin,decoded});
            // console.log(sessionId,admin);
            

            // if (!sessionId) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }
            // console.log(admin?.sessions.find((s)=>s?.id?.toString()===sessionId))

            
        } catch (error) {
            
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


    // setup 2FA and generate QR code and confirm 2FA
    static setup2FA = async (req, res) => {
        const { email } = req.body;
        const admin = await AdminUser.findOne({ email });
        const secret = speakeasy.generateSecret({ name: "Admin Dashboard" });
        qrcode.toDataURL(secret.otpauth_url, async (err, image_data) => {
            if (err) return res.status(500).json({ message: "QR generation failed" });
            admin.twoFA.secret = secret.base32;
            await admin.save();
            res.json({ qr: image_data, secret: secret.base32 });
        });
    };
    static confirm2FA = async (req, res) => {
        const { email, token, secret } = req.body;
        const isVerified = speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token
        });
        if (!isVerified) return res.status(400).json({ message: "Invalid TOTP code" });
        const admin = await AdminUser.findOne({ email });
        admin.twoFA.enabled = true;
        admin.twoFA.secret = secret;
        await admin.save();
        res.json({ message: "2FA enabled" });
    }

}

export default Auth;