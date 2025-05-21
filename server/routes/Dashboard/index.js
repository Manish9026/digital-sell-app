import express from 'express';
import driveOpDashboard from './driveRoutes.js';
import productRoutes from './productRoute.js';
import AuthRoutes from './Auth.js';

const dashboardRoutes = express.Router();


dashboardRoutes.use("/drive", driveOpDashboard);
dashboardRoutes.use("/product", productRoutes)
dashboardRoutes.use("/admin-auth", AuthRoutes);

export default dashboardRoutes;