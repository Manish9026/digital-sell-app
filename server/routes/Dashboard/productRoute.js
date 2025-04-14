import express from 'express';
import { ProductController } from '../../controllers/dashboard/productController.js';
const productRoutes = express.Router();

productRoutes.get("",ProductController.getAllProducts)
productRoutes.get("/:id",ProductController.getSingleProduct);
productRoutes.get("/files/:id",ProductController.getProductFiles)

export default productRoutes