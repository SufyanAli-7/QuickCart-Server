import Wishlist from "../models/wishlist.models.js";
import Product from "../models/product.model.js";

// Add Product to Wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Please provide a productId" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.status === "inactive") {
            return res.status(400).json({ success: false, message: "Product is currently inactive" });
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (wishlist) {
            // Check if product is already in wishlist
            const alreadyExists = wishlist.products.some(id => id.toString() === productId.toString());
            if (alreadyExists) {
                return res.status(400).json({ success: false, message: "Product is already in your wishlist" });
            }

            wishlist.products.push(productId);
            await wishlist.save();
            return res.status(200).json({ success: true, message: "Product added to wishlist successfully", wishlist });
        } else {
            wishlist = new Wishlist({ user: userId, products: [productId] });
            await wishlist.save();
            return res.status(201).json({ success: true, message: "Product added to wishlist successfully", wishlist });
        }

    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get User's Wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.id;

        const wishlist = await Wishlist.findOne({ user: userId }).populate("products");

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                message: "Wishlist fetched successfully",
                wishlist: { user: userId, products: [] },
                count: 0
            });
        }

        // Filter out null (deleted) products and inactive products
        const activeProducts = wishlist.products.filter(prod => prod !== null && prod.status === "active");

        const resultWishlist = wishlist.toObject();
        resultWishlist.products = activeProducts;

        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            count: activeProducts.length,
            wishlist: resultWishlist
        });

    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Remove Product from Wishlist
export const deleteFromWishlist = async (req, res) => {
    try {
        const userId = req.id;
        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Please provide a productId" });
        }

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        const initialLength = wishlist.products.length;
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId.toString());

        if (wishlist.products.length === initialLength) {
            return res.status(404).json({ success: false, message: "Product not found in wishlist" });
        }

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully",
            wishlist
        });

    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
