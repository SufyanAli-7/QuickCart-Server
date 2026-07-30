import { Router } from "express";
import { createOrder, deleteOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/order.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const orderRouter = Router();

// Customer Routes
orderRouter.post('/create',authMiddleware, createOrder);

orderRouter.get('/my-orders', authMiddleware, getMyOrders);

// Admin Routes

orderRouter.get('/all-orders', authMiddleware, getAllOrders);

orderRouter.get('/get-single/:id',authMiddleware, getOrderById);

orderRouter.patch('/update-status/:id', authMiddleware, updateOrderStatus);

orderRouter.delete('/delete-order/:id', authMiddleware, deleteOrder);
export default orderRouter;