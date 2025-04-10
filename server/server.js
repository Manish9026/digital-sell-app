import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()
import DB_connection from './DBconfig/DB.config.js';
import Razorpay from 'razorpay'
import readline from 'readline';
import { DriveController } from './controllers/driveController.js'
import { google } from 'googleapis'
import paymentRouter from './routes/paymentRoutes.js'
const port=process.env.PORT;
const app=express();
app.use(express.json()) 
app.use(cookieParser());

app.use(cors({
    origin:[process.env.BASE_URL,process.env.BASE_URL2,process.env.PORTFOLiO_URL],
    credentials:true,
    methods:["POST","GET","DELETE","PATCH"]
}))


app.use(express.urlencoded({extended:true}))
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});




const clientId="921823961349-kruq5i3piva0gn015v20ftt2prkv2cm9.apps.googleusercontent.com"
const clientSecret="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",redirectUri="http://localhost:2000/oauth2callback"; 
const SCOPE = "https://www.googleapis.com/auth/drive";
const refresh_token="1//0gsxEjMXVgmt_CgYIARAAGBASNwF-L9IrugvXPL_nMyoN3V-n_-5SyH3hNEZPYBFvfMYUfnHcEWlQQBe1YcThPXd6F0xBBcQ5-7E";
const accessToken="ya29.a0AZYkNZiYvG-F_MQ0Lw-XajUbCVuwfLsfD12OvUNeYWSe1fMUT3CSMX2VoMAXIic8a2MkI7MzqvkS5T9W8rhMpWtdryQ7kB_3CWMEhBEHuB_Ia8SZQrcB2XxmghNwDVGFYyxBSURHUnIZYtK2uEL4Cwq0kv0mZfeH1KmYQX9AaCgYKAdcSARASFQHGX2Mih89v983MgWSGCQkiU_XJag0175"
export const auth =new google.auth.OAuth2(clientId, clientSecret,redirectUri);
auth.setCredentials({ refresh_token: refresh_token }); 
    // "https://www.googleapis.com/auth/drive.readonly",
    // "https://www.googleapis.com/auth/userinfo.profile",
    // "https://www.googleapis.com/auth/drive",
 
 

app.get("/",(req,res)=>{
    res.json({
        message:"this is server page"
    }) 
})
 
app.post("/api/download",async(req,res)=>{

    try {
       const { fileId, email, productName } = req.body;
       console.log(fileId, email, productName);

      //  const authUrl = auth.generateAuthUrl({
      //   access_type: "offline",
      //   prompt: "consent",
      //   scope: SCOPE,
      // });
      // console.log("🔗 Open this URL to authorize:\n", authUrl);
    //   open(authUrl);
       

        const link = await DriveController.shareFileWithUser(fileId, email);
        await DriveController.sendDownloadEmail(email, productName, link);
        res.status(200).json({ message: "Email sent successfully", link }); 
    } catch (error) {
        console.log(error);
        
    }
})

app.get("/oauth2callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await auth.getToken(code);
      res.send("✅ Authorization successful! Check your terminal.");
      console.log("\n🔑 ACCESS TOKEN:\n", tokens.access_token);
      console.log("\n🔁 REFRESH TOKEN (save this in .env):\n", tokens.refresh_token);
      process.exit();
    } catch (err) {
      console.error("Error getting tokens:", err.message);
      res.status(500).send("Auth failed.");
    }})

app.use("/api/payment",paymentRouter)
app.listen(port,()=>{
    DB_connection()
    console.log("server runing on port 2000");
})