import { Router } from "express";
import { getAllUsers, getCurrentUser, getUserById } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

// All Users Can Access
userRouter.get('/current', authMiddleware, getCurrentUser);

// Admin Only
userRouter.get('/all', authMiddleware, getAllUsers);

userRouter.get('/:id', authMiddleware, getUserById);

export default userRouter;