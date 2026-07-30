import { Router } from "express";
import { getAllUsers, getCurrentUser, getUserById, updateUserRole } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

// All Users Can Access
userRouter.get('/current', authMiddleware, getCurrentUser);

// Admin Only
userRouter.get('/all', authMiddleware, getAllUsers);

userRouter.get('/details/:id', authMiddleware, getUserById);

userRouter.patch('/update-role/:id', authMiddleware, updateUserRole);

export default userRouter;