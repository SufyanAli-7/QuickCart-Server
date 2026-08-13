import { Router } from "express";
import { login, logout, register, resetPassword, sendResetOtp, setToken } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/set-token', setToken);

authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;