// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
import crypto from 'crypto'
export function generateToken(payload,expiresIn) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn:expiresIn?expiresIn: "15m" });
};


export function verifySignature(orderId, paymentId, signature) {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
};