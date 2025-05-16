import express from 'express';
const productRoutes = express.Router();
import { ProductController } from '../../controllers/dashboard/productController.js';

productRoutes.get("",ProductController.getAllProducts)
productRoutes.get("/:id",ProductController.getSingleProduct);
productRoutes.get("/files/:id",ProductController.getProductFiles)

export default productRoutes