import { Router } from "express";
import { getUserData } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/data', authMiddleware, getUserData);


export default userRouter;