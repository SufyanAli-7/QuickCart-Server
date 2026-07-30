import { Router } from "express";
import { createOrder } from "../controllers/order.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const orderRouter = Router();


orderRouter.post('/create',authMiddleware, createOrder);

export default orderRouter;