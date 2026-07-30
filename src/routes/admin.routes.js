import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/admin.controllers.js";

const adminRouter = Router();

adminRouter.get('/dashboard-stats', authMiddleware, getDashboardStats)

export default adminRouter;