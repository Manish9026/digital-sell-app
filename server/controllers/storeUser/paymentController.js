import razorpayInstance from "../../utils/razorpayConfig.js";
import Razorpay from "razorpay";
import { DriveController } from "./driveController.js";
import { verifySignature } from "../../utils/genrateToken.js";



export class paymentController {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }

  static async createPayment(req, res) {
    const { amount ,productId,productName,fileId} = req.body;
    const {user}=req;
    try {

          
        console.log(amount);
              const order = await razorpayInstance.orders.create({ amount: Number(amount * 100), currency: "INR" ,receipt: "receipt#1"});
      res.json({order:{...order,productId,productName,fileId,email:user?.userEmail,userName:`${user?.firstName} ${user?.lastName}`}, status: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to create order" });
      console.log(err);
      
    }
  }
  static async verifyPayment(req, res) {
    try {
        const { paymentId, orderId, signature, email, productName ,fileId} = req.body;
console.log(paymentId, orderId, signature, email, productName ,fileId);

  if (!verifySignature(orderId, paymentId, signature)) {
    return res.status(400).json({ error: "Invalid signature" });
  }

//   const order = new Order({ email, productName, amount: 499, paymentId, orderId });
//   await order.save();

//   const token = generateToken(email, "product123");
//   const downloadLink = `http://localhost:3000/download?token=${token}`;

//   await sendDownloadEmail(email, productName, downloadLink);
const filelink = await DriveController.shareFileWithUser(fileId, email);
        await DriveController.sendDownloadEmail(email, productName, filelink);
        res.status(200).json({ message: "Email sent successfully", filelink,status:true }); 

//   res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: "Payment verification failed" });
        console.log(error);
        
    }
  }

}