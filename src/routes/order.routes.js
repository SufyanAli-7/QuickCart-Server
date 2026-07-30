import { Router } from "express";
import { createOrder, getAllOrders, getMyOrders, getOrderById } from "../controllers/order.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const orderRouter = Router();

// Customer Routes
orderRouter.post('/create',authMiddleware, createOrder);

orderRouter.get('/my-orders', authMiddleware, getMyOrders);

// Admin Routes

orderRouter.get('/all-orders', authMiddleware, getAllOrders);

orderRouter.get('/get-single/:id',authMiddleware, getOrderById)


export default orderRouter;