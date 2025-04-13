import express from 'express';
import { ProductController } from '../../controllers/dashboard/productController.js';
const productRoutes = express.Router();

productRoutes.get("",ProductController.getAllProducts)

export default productRoutes