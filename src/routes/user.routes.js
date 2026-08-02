import { Router } from "express";
import { deleteUser, getAllUsers, getCurrentUser, getUserById, getCustomerDashboardStats, updateUserRole } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

// All Users Can Access
userRouter.get('/current', authMiddleware, getCurrentUser);

// Customer Specific Routes
userRouter.get('/dashboard-stats', authMiddleware, getCustomerDashboardStats);

// Admin Only
userRouter.get('/all', authMiddleware, getAllUsers);

userRouter.get('/details/:id', authMiddleware, getUserById);

userRouter.patch('/update-role/:id', authMiddleware, updateUserRole);

userRouter.delete('/delete/:id', authMiddleware, deleteUser);

export default userRouter;