import { Router } from "express";
import { createOrder, getMyOrders } from "../controllers/order.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const orderRouter = Router();

// Customer Routes
orderRouter.post('/create',authMiddleware, createOrder);

orderRouter.get('/my-orders', authMiddleware, getMyOrders);

// Admin Routes


export default orderRouter;