import User from "../models/user.model.js";

export const getUserData = async (req, res) => {
    try {
        const id = req.id;
        
        const user = await User.findById(id).select("-password");
        
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found'});
        }

        return res.status(200).json({success: true, user});
    }
    catch (error) {
        console.error('Error during logout:', error.message);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const { id, role } = req;

        if (role !== 'admin' || !id) {
            return res.status(403).json({success: false, message: 'Forbidden'});
        }

        const users = await User.find({}).select("-password");

        return res.status(200).json({success: true, users});
    }
    catch (error) {
        console.error('Error during logout:', error.message);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}
