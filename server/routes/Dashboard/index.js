import express from 'express';
import driveOpDashboard from './driveRoutes.js';
const dashboardRoutes= express.Router();


dashboardRoutes.use("/drive", driveOpDashboard);


export default dashboardRoutes;