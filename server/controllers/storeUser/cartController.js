import { userCartModel } from "../../models/storeUserModel.js";
import {goodResponse,badResponse} from '../../utils/response.js'
import { productModel  } from "../../models/dashboardModel.js";
import mongoose from "mongoose";
export class CartController {

    static async addToCart(req, res) {
        try {
            const { _id: userId } = req.user; // Assuming you have userId in req.user
            const {productId } = req.body;
        
            if (!userId || !productId) {
              return res.status(400).json({ message: 'userId and productId are required' });
            }
        
            const productObjectId = new mongoose.Types.ObjectId(productId);
        
            // Find existing cart for user
            let cart = await userCartModel.findOne({ userId });
        console.log(cart,"cart");
        
            if (cart) {
              // Check if product already exists
              const alreadyInCart = cart.product.some(
                p => p?.id?.toString() === productObjectId?.toString()
              );
        
              if (!alreadyInCart) {
                cart.product.push({id:productObjectId});
                await cart.save();        
               return goodResponse({res,message:"Product added to cart",statusCode:200})
              }

              return badResponse({res,message:"Product already in cart",statusCode:200})
        
            } else {
              // Create new cart for user
              cart = await userCartModel.create({
                userId,
                product: [{id:productObjectId}],
              }); 
            }
        
            return goodResponse({res,message:"Product added to cart",statusCode:200})
        
          } catch (error) {
            console.error('Add to cart error:', error);
            badResponse({res,message:"Internal server error",statusCode:500})
            // res.status(500).json({ message: 'Internal server error' });
          }
    }

    static async getCart(req, res) {
        
      try {
        let { _id: userId } = req?.user; 
        // const userId =req.body.userId

        const cartItems = await userCartModel.find({ userId });
        if (cartItems.length === 0) return [];
    
        // Extract all product IDs from all carts (flattened)
        const allProductIds = cartItems.flatMap(item => item.product.map(p => p?.id.toString()));
        console.log(allProductIds,"allProductIds");

        const uniqueProductIds = [...new Set(allProductIds)];
    
        // Get product details from db2
        const products = await productModel.find({ prdId: { $in: uniqueProductIds } });
    
        console.log(products,"products");
        
        // Merge products into cart
       
        goodResponse({res,message:"Product fetched from cart",statusCode:200,data:{products}})
        // res.json({products})
    
       
    
      } catch (err) {
        console.error('Error fetching carts:', err);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
    static async removeFromCart(req, res) {
try {
 const {_id:userId}=req.user;
 const {productId}=req.body;
//  console.log(userId,productId);
 
  const newData = await userCartModel.updateOne(
    { userId },
    {
      $pull: {
        product: { id: productId },
      },
    }
  );
  // await newData.save();

  return goodResponse({res,message:"cart removed !!",statusCode:200})

} catch (error) {
  console.log(error);
  
  return badResponse({res,message:"server error "})
}
    }


// Function to get merged cart


// // Example usage
// (async () => {
//   const userId = '66204a69fae126ef34567890'; // Replace with your userId
//   const cart = await getUserCartWithProducts(userId);
//   console.log(cart);
// })();

}