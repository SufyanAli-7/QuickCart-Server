import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addItemsToCart = async (req, res) => {
    try {
        const { id } = req;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
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