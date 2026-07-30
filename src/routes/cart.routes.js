import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addItemsToCart, clearCart, getItemsFromCart, removeItemFromCart, updateCartItem } from "../controllers/cart.controllers.js";

const cartRouter = Router();


cartRouter.post("/add", authMiddleware, addItemsToCart);

cartRouter.get("/get", authMiddleware, getItemsFromCart);

cartRouter.patch('/update/:productId', authMiddleware, updateCartItem)

cartRouter.delete('/delete/:productId', authMiddleware, removeItemFromCart)

cartRouter.delete('/clear', authMiddleware, clearCart)

export default cartRouter;