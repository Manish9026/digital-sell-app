// import { get } from "mongoose";
import { couponModel, productModel } from "../../models/dashboardModel.js";
import { badResponse, goodResponse } from "../../utils/response.js";
import { getDriveService } from "./driveController.js";

export class ProductController{

     static getAllProducts=async(req,res)=>{
        try {
          const product=await productModel.find();
          if(product.length>0){
            return goodResponse({res,message:"record founded !!",data:{product},statusCode:200})
          }
          return badResponse({res,message:"no produsct are avalavial at this movement !!"})
        } catch (error) {
          console.log(error);
          
          return badResponse({res,statusCode:500,message:"sever error"})
        }
      }
     static getSingleProduct=async(req,res)=>{
      try {
        const prdId=req.params.id;
        console.log(prdId);
        
        if(!prdId) return badResponse({res,message:"product id is required !!"})
        const product=await productModel.findOne({prdId});
        if(!product) return badResponse({res,message:"product not found !!"})
          return goodResponse({res,message:"product found !!",data:{product}})
        
      } catch (error) {
        console.log(error);
        
        return badResponse({res,statusCode:500,message:"sever error"})
      }
     } 

    static getProductFiles=async (req, res) => {
        try {
          const fileId = req.params.id;
          const mimeType = req.query.mimeType;
          console.log(mimeType,fileId);

          if(!fileId) {
            return badResponse({res,message:"file id is required !!"})
             
          }
          const drive=await getDriveService(); // Assuming you have a function to get the drive instance
          const result = await drive.files.get(
            { fileId, alt: "media" },
            { responseType: "stream" }
          );

          res.setHeader("Content-Type", mimeType);
          result.data.pipe(res);
        } catch (error) {
          // console.error("Error fetching image:", error);  
          res.status(500).send("Error fetching image");
        }
      }
 static getCoupons = async (req, res) => {
  try {
    console.log("✅ /hello route hit:", req.method, req.originalUrl);
    
    let coupons = await couponModel.find({
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gte: new Date() } },
      ],
    });

    if (!coupons || coupons.length === 0) {
      return res.status(404).json({ message: "No active coupons found." });
    }

    return res.status(200).json({ message: "Coupons found", coupons });
    
  } catch (error) {
    console.error("❌ Error in getCoupons:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

      
}