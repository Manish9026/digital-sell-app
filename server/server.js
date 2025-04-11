import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()
import DB_connection from './DBconfig/DB.config.js';
import Razorpay from 'razorpay'
import readline from 'readline';

import { google } from 'googleapis'
import paymentRouter from './routes/storeUser/paymentRoutes.js'
import { DriveController } from './controllers/storeUser/driveController.js'
import userAuthRoutes from './routes/storeUser/authRoutes.js'
const port = process.env.PORT;
const app = express();

app.use(express.json())
app.use(cookieParser());

console.log(process.env.BASE_URL, process.env.BASE_URL2);

app.use(cors({
    origin: [process.env.BASE_URL, process.env.BASE_URL2, "https://digital-sell.vercel.app", process.env.PORTFOLiO_URL],
    credentials: true,
    methods: ["POST", "GET", "DELETE", "PATCH"]
}))


app.use(express.urlencoded({ extended: true }))


const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET_KEY;
const redirectUri = process.env.REDIRECT_URL;
const SCOPE = "https://www.googleapis.com/auth/drive";
const refresh_token = process.env.REFRESH_TOKEN
const accessToken = process.env.ACCESSTOKEN;
export const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
auth.setCredentials({ refresh_token: refresh_token });
// "https://www.googleapis.com/auth/drive.readonly",
// "https://www.googleapis.com/auth/userinfo.profile",
// "https://www.googleapis.com/auth/drive",



app.get("/", (req, res) => {
    res.json({
        message: "this is server page"
    })
})

app.post("/api/download", async (req, res) => {

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
    }
})

app.use("/api/payment", paymentRouter)
// store-user-auth-apis
app.use("/api/user", userAuthRoutes)
app.listen(port, () => {
    DB_connection()
    console.log("server runing on port 2000");
})