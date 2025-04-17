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
const orderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    },
},{timestamps:{createdAt:true,updatedAt:false}});
const userOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'storeUser',
    },
    orders:[orderSchema],
},{timestamps:true});

export const userOrderModel= connectStoreUserDB.model('userOrder', userOrderSchema);
