import jwt from "jsonwebtoken";
import { AdminUser } from "../../models/dashboardModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { badResponse, createAccessToken, createRefreshToken } from "../../controllers/dashboard/authController.js";

const updateRefreshToken = async (req, res, decoded, token) => {
  try {
    // const token = req.cookies?.refreshToken;
    console.log("updateRefreshToken", decoded);

    // if (!token) return res.status(401).json({ message: "No refresh token" });

    // // 1. Verify refresh token
    // const decoded = jwt.verify(token, process.env.ADMIN_REFRESH_TOKEN_SECRET);
    const { id, sessionId } = decoded;

    if (!id || !sessionId) return res.status(401).json({ message: "Invalid token owner" });
    console.log(sessionId, id);


    // 2. Find admin by ID
    const admin = await AdminUser.findById(id);
    if (!admin) return res.status(401).json({ message: "Invalid token owner" });

    // 3. Find the matching session
    const session = admin.sessions.find(s => s?.id?.toString() === sessionId);
    if (!session) return res.status(403).json({ message: "Session not found" });

    // console.log("ip",req.ip,session.ip);
    // console.log("agent",req.headers['user-agent'],session?.userAgent)
    // viladate device session using ip
    if (session?.ip !== req.ip) return res.status(403).json({ message: "IP mismatch" });
    if (session?.userAgent !== req.headers['user-agent']) return res.status(403).json({ message: "User agent mismatch" });

    // 4. Compare hashed token
    const isValid = await bcrypt.compare(token, session.refreshTokenHash);
    if (!isValid) return res.status(403).json({ message: "Invalid token" });

    // 5. Rotate refresh token
    const newSessionId = new mongoose.Types.ObjectId().toHexString();
    const newRefreshToken = createRefreshToken({ id: admin._id, sessionId: newSessionId });
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    const newAccessToken = createAccessToken({ id: admin._id, sessionId: newSessionId });

    // 6. Update session: remove old, insert new
    console.log(admin.sessions.filter(s => s?.id?.toString() !== sessionId), "admin.sessions");

    admin.sessions = admin.sessions.filter(s => s?.id?.toString() !== sessionId);
    admin.sessions.push({
      id: newSessionId,
      refreshTokenHash: newRefreshTokenHash,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      lastUsed: new Date()
    });

    await admin.save();

    // 7. Send tokens
      res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 1000 * 60 * 15 });
        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "None" , maxAge: 1000 * 60 * 60 * 24 * 7 });

    // res.status(201).json({ accessToken: newAccessToken ,message:"Token refreshed"});

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };

  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjcxYzFiZjZhYjgwM2NjNTYzOTZjMSIsInNlc3Npb25JZCI6IjY4MjcyYWIyZmEyYjg4ZTJkZmM0MGNmZCIsImlhdCI6MTc0NzM5NzI5OCwiZXhwIjoxNzQ4MDAyMDk4fQ.LM41DhhqSUc5jsPumFuHmSATn09lxSVeOP_VdH2Zp98; Path=;

const verifyAdminToken = async (req, res, next) => {
  try {
    const { refreshToken, accessToken, tempToken } = req.cookies;

    // token = accessToken || refreshToken || tempToken;
    let decoded;

    console.log(tempToken,"tempToken");
    console.log(refreshToken,"refreshToken");
    console.log(accessToken,"accessToken");

    if(!refreshToken && !accessToken && !tempToken) {
      return badResponse({res, message:"No token provided",statusCode:401,});
    }

    try {
      // Try verifying with Access Token secret
      decoded = jwt.verify(accessToken, process.env.ADMIN_ACCESS_TOKEN_SECRET);

    } catch (err) {
      // If failed, check if it's a tempToken
      // console.log(err,"tempToken");
      try {
        decoded = jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_SECRET);
        if (decoded) {
          await updateRefreshToken(req, res, decoded, refreshToken);
        }
      } catch (error) {
        try {
          decoded = jwt.verify(tempToken, process.env.ADMIN_TEMP_TOKEN_SECRET); // TEMP_SECRET
          req.twoFactorAuth = true; // Optional flag to detect it's a tempToken
        } catch (tempErr) {
          console.log(tempErr, "tempErr");

          return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
        }
      }


    }

    // Fetch admin from DB
    const admin = await AdminUser.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin not found" });
    }

    req.admin = admin;
    req.decoded = decoded;
    next();

  } catch (err) {
    console.error("Token verification failed", err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};



export default verifyAdminToken;

