import express from 'express';
const productRoutes = express.Router();
import { ProductController } from '../../controllers/dashboard/productController.js';
import verifyAdminToken from '../../middlewares/dashboard/adminVerify.js';

productRoutes.get("",ProductController.getAllProducts)
productRoutes.get("/files/:id",ProductController.getProductFiles)
productRoutes.get("/coupons",ProductController.getCoupons)
productRoutes.get("/:id",ProductController.getSingleProduct);




export default productRoutes