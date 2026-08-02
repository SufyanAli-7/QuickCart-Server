import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export const getDashboardStats = async (req, res) => {
    try {
        const { id, role } = req;

        if (role !== "admin" || !id) {
            return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
        }

        // Parallel database queries using Promise.all for optimal performance
        const [
            totalUsers,
            totalCustomers,
            totalAdmins,
            totalProducts,
            totalOrders,
            revenueResult,
            recentOrders,
            recentUsers
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "customer" }),
            User.countDocuments({ role: "admin" }),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([
                { $match: { status: { $ne: "Cancelled" } } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
            ]),
            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("userId", "fullName email"),
            User.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        return res.status(200).json({
            success: true,
            message: "Dashboard statistics fetched successfully",
            stats: {
                totalUsers,
                totalCustomers,
                totalAdmins,
                totalProducts,
                totalOrders,
                totalRevenue,
                recentOrders,
                recentUsers
            }
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
