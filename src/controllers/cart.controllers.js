import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addItemsToCart = async (req, res) => {
    try {
        const { id } = req;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1 || typeof quantity !== "number") {
            return res.status(400).json({ success: false, message: "Please provide a valid productId and quantity (at least 1)" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.status === "inactive") {
            return res.status(400).json({ success: false, message: "Product is currently inactive and cannot be added to cart" });
        }

        if (product.stock < 1) {
            return res.status(400).json({ success: false, message: "Product is out of stock" });
        }

        let cart = await Cart.findOne({ userId: id });

        if (cart) {
            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            const currentCartQuantity = existingItem ? existingItem.quantity : 0;
            const newTotalQuantity = currentCartQuantity + quantity;

            // Stock Validation
            if (newTotalQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock. Only ${product.stock} unit(s) available. You already have ${currentCartQuantity} unit(s) in your cart.`
                });
            }

            if (existingItem) {
                existingItem.quantity = newTotalQuantity;
            } else {
                cart.items.push({ productId, quantity });
            }

            await cart.save();
            return res.status(200).json({ success: true, message: "Item added to cart successfully", cart });
        } else {
            // Stock Validation for new cart
            if (quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock. Only ${product.stock} unit(s) available.`
                });
            }

            cart = new Cart({ userId: id, items: [{ productId, quantity }] });
            await cart.save();
            return res.status(200).json({ success: true, message: "Item added to cart successfully", cart });
        }

    } catch (error) {
        console.error("Error adding items to cart:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const getItemsFromCart = async (req, res) => {
    try {
        const { id } = req;

        const cart = await Cart.findOne({ userId: id }).populate("items.productId");

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart fetched successfully",
                cart: { userId: id, items: [] },
                totalItems: 0,
                subtotal: 0
            });
        }

        let totalItems = 0;
        let subtotal = 0;

        // Calculate totalItems and subtotal with null check (in case product was deleted by admin)
        cart.items.forEach(item => {
            if (item.productId && typeof item.productId.price === "number") {
                totalItems += item.quantity;
                subtotal += item.productId.price * item.quantity;
            }
        });

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart,
            totalItems,
            subtotal
        });

    } catch (error) {
        console.error("Error fetching cart items:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const updateCartItem = async (req, res) => {
    try {
        const { id } = req;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!productId || quantity == null || typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({ success: false, message: "Please provide a valid productId and quantity (at least 1)" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.status === "inactive") {
            return res.status(400).json({ success: false, message: "Product is currently inactive" });
        }

        // Stock Validation
        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Only ${product.stock} unit(s) available.`
            });
        }

        const cart = await Cart.findOne({ userId: id });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const item = cart.items.find(item => item.productId.toString() === productId);

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        item.quantity = quantity;
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            cart
        });

    } catch (error) {
        console.error("Error updating cart item:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const removeItemFromCart = async (req, res) => {
    try {
        const { id } = req;
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Please provide a productId" });
        }

        const cart = await Cart.findOne({ userId: id });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cart
        });

    } catch (error) {
        console.error("Error removing item from cart:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const clearCart = async (req, res) => {
    try {
        const { id } = req;

        const cart = await Cart.findOne({ userId: id });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cart.items = [];
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


