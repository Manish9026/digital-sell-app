import express from 'express';
import driveOpDashboard from './driveRoutes.js';
import productRoutes from './productRoute.js';
const dashboardRoutes= express.Router();


dashboardRoutes.use("/drive", driveOpDashboard);
dashboardRoutes.use("/product",productRoutes)

export default dashboardRoutes;