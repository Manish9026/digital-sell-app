import jwt from "jsonwebtoken";
import { AdminUser } from "../../models/dashboardModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { badResponse, createAccessToken, createRefreshToken, getDeviceInfo } from "../../controllers/dashboard/authController.js";
import { UAParser } from "ua-parser-js"

// const  logout = async (req,decoded, token) => {
//         const { refreshToken } = req.cookies;
//         if (!refreshToken) return res.status(401).json({ message: "No refresh token" });
//         const decoded = jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_SECRET);
//         const { id, sessionId } = decoded;
//         if (!id || !sessionId) return res.status(401).json({ message: "Invalid token owner" });
//         const admin = await AdminUser.findById(id);
//         if (!admin) return res.status(401).json({ message: "Invalid token owner" });
//         admin.sessions = admin.sessions.filter(s => s?.id?.toString() !== sessionId);
//         await admin.save();
//         res.clearCookie("refreshToken",{ httpOnly: true, secure: true, sameSite: "None" });
//         res.clearCookie("accessToken",{ httpOnly: true, secure: true, sameSite: "None" });
//         // res.json({ message: "Logged out successfully" });
//         return goodResponse({ res, statusCode: 200, message: "Logged out successfully" });
//     }

const updateRefreshToken = async (req, decoded, token) => {
  try {
    const { id, sessionId } = decoded;

    if (!id || !sessionId) throw new Error("Invalid token owner");

    const admin = await AdminUser.findById(id);
    if (!admin) throw new Error("Invalid token owner");

    const unUsedSession = 15 * 24 * 60 * 60 * 1000;
    const now = Date.now();


    const session = admin.sessions.find(s => s?.id?.toString() === sessionId);
    if (!session) throw new Error("Session not found");

    if (session?.ip !== req.ip || session?.userAgent !== req.headers['user-agent']) {
      throw {message:"Unauthorized:Device mismatched!"};
    }


    const isValid = await bcrypt.compare(token, session.refreshTokenHash);
    if (!isValid) throw new Error("Invalid refresh token");

    const newSessionId = new mongoose.Types.ObjectId().toHexString();
    const newRefreshToken = createRefreshToken({ id: admin._id, sessionId: newSessionId });
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    const newAccessToken = createAccessToken({ id: admin._id, sessionId: newSessionId });

    // admin.sessions = admin.sessions.filter(s => s?.id?.toString() !== sessionId);
    admin.sessions = admin.sessions.filter(
      s => now - new Date(s.lastUsed).getTime() < unUsedSession && s?.id?.toString() !== sessionId
    );
    const adminInfo=await getDeviceInfo(req);
    admin.sessions.push({
      id: newSessionId,
      refreshTokenHash: newRefreshTokenHash,
     ...adminInfo,
      lastUsed: new Date()
    });

    await admin.save();

    // 🧠 Store new tokens in req to set cookies later
    req.newAccessToken = newAccessToken;
    req.newRefreshToken = newRefreshToken;

    return { admin, decoded: { id: admin._id, sessionId: newSessionId } };

  } catch (err) {
    throw err;
  }
};


const verifyAdminToken = async (req, res, next) => {
  try {
    const { refreshToken, accessToken, tempToken } = req.cookies;

    // token = accessToken || refreshToken || tempToken;
    let decoded;
    let admin;


    console.log(tempToken, "tempToken");
    console.log(refreshToken, "refreshToken");
    console.log(accessToken, "accessToken");
    if (!refreshToken && !accessToken && !tempToken) {
      return badResponse({ res, message: "No token provided", statusCode: 401, });
    }

    try {
      // Try verifying with Access Token secret
      decoded = jwt.verify(accessToken, process.env.ADMIN_ACCESS_TOKEN_SECRET);

    } catch (err) {
      // If failed, check if it's a tempToken
      // console.log(err,"tempToken");
      try {
        decoded = jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_SECRET);
        const result = await updateRefreshToken(req, decoded, refreshToken);

        // Assign fresh admin + decoded
        admin = result.admin;
        decoded = result.decoded;
      } catch (error) {
        try {
          decoded = jwt.verify(tempToken, process.env.ADMIN_TEMP_TOKEN_SECRET); // TEMP_SECRET
          req.twoFactorAuth = true; // Optional flag to detect it's a tempToken
        } catch (tempErr) {
          console.log(error?.message,error, "tempErr");

          return badResponse({ res, message: error?.message || "Unauthorized: Invalid or expired token", statusCode: 401 });
        }
      }


    }

    // Fetch admin from DB
    if (!admin) {
      admin = await AdminUser.findById(decoded.id);
      if (!admin) {
        return res.status(401).json({ error: "Unauthorized: Admin not found" });
      }
    }

    req.admin = admin;
    req.decoded = decoded;

    // 🌱 Set new tokens if generated
    if (req.newAccessToken && req.newRefreshToken) {
      res.cookie("accessToken", req.newAccessToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 1000 * 60 * 15 });
      res.cookie("refreshToken", req.newRefreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 1000 * 60 * 60 * 24 * 7 });
    }

    next();

  } catch (err) {
    console.error("Token verification failed", err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};



export default verifyAdminToken;

