import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addItemsToCart, getItemsFromCart } from "../controllers/cart.controllers.js";

const cartRouter = Router();


cartRouter.post("/add", authMiddleware, addItemsToCart);

cartRouter.get("/get", authMiddleware, getItemsFromCart);

export default cartRouter;