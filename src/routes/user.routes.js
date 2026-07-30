import { Router } from "express";
import { getAllUsers, getUserData } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

// All Users Can Access
userRouter.get('/data', authMiddleware, getUserData);

// Admin Only
userRouter.get('/all', authMiddleware, getAllUsers);


export default userRouter;