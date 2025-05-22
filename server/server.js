import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()
import {connectStoreUserDB, connectDashboardDB} from './DBconfig/DB.config.js';
import paymentRouter from './routes/storeUser/paymentRoutes.js'
import userAuthRoutes from './routes/storeUser/authRoutes.js'
import dashboardRoutes from './routes/Dashboard/index.js'
import storeUserRoutes from './routes/storeUser/index.js'
const port = process.env.PORT;
const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

console.log(process.env.BASE_URL, process.env.BASE_URL2);

app.use(cors({
    origin: [process.env.BASE_URL, process.env.BASE_URL2, "https://digital-sell.vercel.app", process.env.PORTFOLiO_URL],
    credentials: true,
    methods: ["POST", "GET", "DELETE", "PATCH"]
}))



const SCOPE=[
"https://www.googleapis.com/auth/drive.readonly",
"https://www.googleapis.com/auth/userinfo.profile",
"https://www.googleapis.com/auth/drive",
]
 
app.get("/", (req, res) => {
    res.json({
        message: "this is server page"
    })
})
app.use("/api/payment", paymentRouter)
// store-user-auth-apis
app.use("/api/user", userAuthRoutes)
app.use("/api/store/user", storeUserRoutes);
// dashboard-apis
app.use("/api/dashboard", dashboardRoutes)
Promise.all([
    connectStoreUserDB.once('open', () => console.log('✅ Connected to userDB')),
    connectDashboardDB.once('open', () => console.log('✅ Connected to DashboardDB')),
  ]) 
    .then(() => {
      app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
      });
    })
    .catch((err) => {
      console.error('❌ Error connecting to databases:', err);
      process.exit(1); // Stop the app if DB connections fail
    });


