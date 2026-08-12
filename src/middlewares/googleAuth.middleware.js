import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const googleAuthMiddleware = async (req, res, next) => {
  try {
    const { name, email } = req.user._json;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("working middleware", token, req.user);
    next();
  } catch (error) {
    next(error);
  }
};

export default googleAuthMiddleware;