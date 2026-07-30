import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addToWishlist, getWishlist, deleteFromWishlist } from "../controllers/wishlist.controllers.js";

const wishlistRouter = Router();

wishlistRouter.post('/add', authMiddleware, addToWishlist);
wishlistRouter.get('/get', authMiddleware, getWishlist);
wishlistRouter.delete('/delete/:id', authMiddleware, deleteFromWishlist);

export default wishlistRouter;