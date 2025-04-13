import { productModel } from "../../models/dashboardModel.js";
import { badResponse, goodResponse } from "../../utils/response.js";

export class ProductController{

     static getAllProducts=async(req,res)=>{
        try {
          const product=await productModel.find();
          if(product.length>0){
            return goodResponse({res,message:"record founded !!",data:{product},statusCode:200})
          }
          return badResponse({res,message:"no produsct are avalavial at this movement !!"})
        } catch (error) {
          return badResponse({res,statusCode:500,message:"sever error"})
        }
      }
}