
import  {google}   from 'googleapis' 
import dotenv from 'dotenv'
dotenv.config();



const googleAuth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET_KEY,
  process.env.REDIRECT_URL
);

export {googleAuth}
