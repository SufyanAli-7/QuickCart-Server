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

    // Store token on req so the redirect handler can pass it via URL
    // instead of setting a cross-site cookie that browsers block
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};

export default googleAuthMiddleware;