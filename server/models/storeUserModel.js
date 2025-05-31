import  mongoose from 'mongoose';
import { connectStoreUserDB } from '../DBconfig/DB.config.js';
// import { date } from 'joi';


/* user cart schema && model */

const userCartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'storeUser',
    },
    product:{
        type: [
            mongoose.Schema({
                id:mongoose.Schema.Types.ObjectId,
                date:{type:Date,default:Date.now},
            },{ _id : false })
            // {id:mongoose.Schema.Types.ObjectId,updatedAt:Date.now}
        ],
        // ref: 'product',
    }
},{timestamps:true});

export const userCartModel= connectStoreUserDB.model('userCart', userCartSchema);


/* user order schema && model */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'storeUser',
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    appliedCoupen: {
        code:String,
        id:mongoose.Schema.Types.ObjectId,
        
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Razorpay', 'Stripe', 'PayPal'],
      required: true,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
  { timestamps: true }
);
export const userOrderModel= connectStoreUserDB.model('userOrder', orderSchema);
