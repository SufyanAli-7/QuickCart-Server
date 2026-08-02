import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Wishlist from "../models/wishlist.models.js";
import Cart from "../models/cart.model.js";

export const getCurrentUser = async (req, res) => {
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

// Get Customer Dashboard Statistics (Total Orders, Total Spent, Wishlist Items, Cart Items)
export const getCustomerDashboardStats = async (req, res) => {
    try {
        const userId = req.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Count total orders placed by customer
        const totalOrders = await Order.countDocuments({ userId });

        // Calculate total spent (excluding cancelled orders)
        const activeOrders = await Order.find({ userId, status: { $ne: 'Cancelled' } });
        const totalSpent = activeOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Count items in wishlist
        const wishlist = await Wishlist.findOne({ user: userId });
        const wishlistItems = wishlist ? wishlist.products.length : 0;

        // Count items in cart
        const cart = await Cart.findOne({ userId });
        const cartItems = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

        return res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                totalSpent,
                wishlistItems,
                cartItems
            }
        });
    } catch (error) {
        console.error("Error fetching customer dashboard stats:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { id, role } = req;

        if (role !== 'admin' || !id) {
            return res.status(403).json({success: false, message: 'Forbidden'});
        }

        const users = await User.find({}).select("-password").sort({createdAt: -1});

        return res.status(200).json({success: true, users});
    }
    catch (error) {
        console.error('Error during logout:', error.message);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}


export const getUserById = async (req, res) => {
    try {
        const { id, role } = req;

        if (role !== 'admin' || !id) {
            return res.status(403).json({success: false, message: 'Forbidden'});
        }

        const userId = req.params.id;

        const user = await User.findById(userId).select("-password");
        
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


export const updateUserRole = async (req, res) => {
    try {
        const { id, role } = req;

        if (role !== 'admin' || !id) {
            return res.status(403).json({success: false, message: 'Forbidden'});
        }

        const userId = req.params.id;
        const { newRole } = req.body;

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found'});
        }

        user.role = newRole;
        await user.save();

        return res.status(200).json({success: true, user});
    }
    catch (error) {
        console.error('Error during logout:', error.message);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}


export const deleteUser = async (req, res) => {
    try {
        const { id, role } = req;

        if (role !== 'admin' || !id) {
            return res.status(403).json({success: false, message: 'Forbidden'});
        }

        const userId = req.params.id;

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({success: false, message: 'User not found'});
        }

        await user.deleteOne();

        return res.status(200).json({success: true, message: 'User deleted successfully'});
    }
    catch (error) {
        console.error('Error during logout:', error.message);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}