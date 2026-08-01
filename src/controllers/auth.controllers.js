import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { generateOTP, getPasswordResetOtpHtml } from "../utils/utils.js";
import { sendEmail } from "../services/email.service.js";

export const register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({success: false,  message: 'All fields are required' });
        }   
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: role || 'customer'
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: "7d" });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        return res.status(201).json({success: true, message: 'User registered successfully'});

    } catch (error) {
        console.error('Error during registration:', error.message);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}   

export const login = async (req, res) => {
    try {

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({success: false, message: 'All fields are required'});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: 'Invalid email or password'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid){
            return res.status(400).json({success: false, message: 'Invalid email or password'});
        }

        const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: "7d" });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        return res.status(200).json({success: true, message: 'User logged in successfully'});  

    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}   

export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).json({success: true, message: 'Logout Successful'});
    }
    catch (error) {
        console.error('Error during logout:', error.message);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}


// send reset password OTP to the user email
export const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({success: false, message: 'Email is required'});            
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({success: false, message: 'User Not Found'});            
        }

        const otp = generateOTP();

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send OTP to user's email
        await sendEmail(
            user.email,
            'Password Reset OTP',
            '',
            getPasswordResetOtpHtml(user.fullName, otp)
        );

        res.status(200).json({success: true, message: 'OTP sent successfully'});
    }
    catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

// reset user password using OTP
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({success: false, message: 'Email, OTP and New Password are required'});            
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({success: false, message: 'User Not Found'});            
        }

        if (user.resetOtp !== otp || user.resetOtp === '') {
            return res.status(400).json({success: false, message: 'Invalid OTP'});
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({success: false, message: 'OTP Expired'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = null;
        await user.save();

        res.status(200).json({success: true, message: 'Password reset successfully'});
    }
    catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}