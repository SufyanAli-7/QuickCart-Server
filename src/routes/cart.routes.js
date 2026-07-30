import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addItemsToCart } from "../controllers/cart.controllers.js";

const cartRouter = Router();

cartRouter.post("/add", authMiddleware, addItemsToCart);

export default cartRouter;