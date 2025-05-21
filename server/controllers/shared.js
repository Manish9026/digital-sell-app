import { googleAuth } from "../DBconfig/googleClient.js";
import { AdminUser, driveModel } from "../models/dashboardModel.js"


export const driveAccess=async()=>{

    const adminId="68271c1bf6ab803cc56396c1";

    // const admin=await AdminUser.findById(adminId);

    const drive=await driveModel.findOne({isAccess:true});

    console.log("\n\n <-----------------------------------------data----------------------------->\n\n");
    console.log(drive);
    
    
    if(!drive)  throw {message:"drive connection are failed!!"} 
    googleAuth.setCredentials({refresh_token:drive?.refreshToken,access_token:drive?.accessToken})

    return googleAuth


}