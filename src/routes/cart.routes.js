import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addItemsToCart, getItemsFromCart, updateCartItem } from "../controllers/cart.controllers.js";

const cartRouter = Router();


cartRouter.post("/add", authMiddleware, addItemsToCart);

cartRouter.get("/get", authMiddleware, getItemsFromCart);

cartRouter.patch('/update/:productId', authMiddleware, updateCartItem)

export default cartRouter;