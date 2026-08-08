import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Stripe from "stripe";
import config from "../config/config.js";

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
    try {
        const userId = req.id;
        const { shippingDetails, paymentStatus, paymentMethod } = req.body;

        // 1. Validate shipping details
        if (!shippingDetails) {
            return res.status(400).json({ success: false, message: "Shipping details are required" });
        }

        const { fullName, email, phone, address, city, postalCode, orderNote } = shippingDetails;
        if (!fullName || !email || !phone || !address || !city || !postalCode) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required shipping details (fullName, email, phone, address, city, postalCode)"
            });
        }

        // 2. Fetch User's Cart with populated product details
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Your cart is empty" });
        }

        const orderItems = [];
        let totalItems = 0;
        let totalAmount = 0;

        // 3. Validate items & stock availability
        for (const item of cart.items) {
            const product = item.productId;

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "One or more products in your cart no longer exist"
                });
            }

            if (product.status === "inactive") {
                return res.status(400).json({
                    success: false,
                    message: `Product "${product.name}" is currently inactive and cannot be ordered`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for "${product.name}". Available stock: ${product.stock}, requested: ${item.quantity}`
                });
            }

            // Build item format matching OrderItemSchema
            orderItems.push({
                productID: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                category: product.category,
                imageURL: product.imageURL
            });

            totalItems += item.quantity;
            totalAmount += product.price * item.quantity;
        }

        // 4. Create Order document
        const order = await Order.create({
            userId,
            items: orderItems,
            totalAmount,
            totalItems,
            shippingDetails: {
                fullName,
                email,
                phone,
                address,
                city,
                postalCode,
                orderNote: orderNote || ""
            },
            paymentMethod: paymentMethod || "COD",
            paymentStatus: paymentStatus || "Pending",
            status: "Pending"
        });

        // 5. Update Product Stock (Deduct purchased quantity from product stock)
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // 6. Clear User Cart after successful order
        cart.items = [];
        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Create Stripe Checkout Session (No Webhook flow)
export const createStripeCheckoutSession = async (req, res) => {
    try {
        const userId = req.id;
        const { shippingDetails } = req.body;

        if (!shippingDetails) {
            return res.status(400).json({ success: false, message: "Shipping details are required" });
        }

        const { fullName, email, phone, address, city, postalCode, orderNote } = shippingDetails;
        if (!fullName || !email || !phone || !address || !city || !postalCode) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required shipping details"
            });
        }

        // Fetch User's Cart
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Your cart is empty" });
        }

        // Validate stock
        for (const item of cart.items) {
            const product = item.productId;
            if (!product) {
                return res.status(400).json({ success: false, message: "One or more products no longer exist" });
            }
            if (product.status === "inactive") {
                return res.status(400).json({ success: false, message: `Product "${product.name}" is inactive` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for "${product.name}"` });
            }
        }

        // Build Stripe Line Items
        const line_items = cart.items.map((item) => {
            const product = item.productId;
            return {
                price_data: {
                    currency: "pkr",
                    product_data: {
                        name: product.name,
                        images: product.imageURL ? [product.imageURL] : [],
                        description: product.category || "Product item"
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            customer_email: email,
            success_url: `${config.FRONTEND_URL}/verify-stripe-payment?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.FRONTEND_URL}/cart`,
            metadata: {
                userId,
                fullName,
                email,
                phone,
                address,
                city,
                postalCode,
                orderNote: orderNote || ""
            }
        });

        return res.status(200).json({
            success: true,
            url: session.url,
            sessionId: session.id
        });

    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        return res.status(500).json({ success: false, message: error.message || "Failed to initialize Stripe payment" });
    }
};

// Verify Stripe Payment Session & Process Order (No Webhook flow)
export const verifyStripePaymentSession = async (req, res) => {
    try {
        const userId = req.id;
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ success: false, message: "Stripe session_id is required" });
        }

        // Check if an order with this session ID already exists
        const existingOrder = await Order.findOne({ stripeSessionId: session_id });
        if (existingOrder) {
            return res.status(200).json({
                success: true,
                message: "Order already verified and processed",
                order: existingOrder
            });
        }

        // Retrieve Stripe Session
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (!session || session.payment_status !== "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed. Session is not paid."
            });
        }

        const { fullName, email, phone, address, city, postalCode, orderNote } = session.metadata || {};

        // Fetch User's Cart
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty or order already completed" });
        }

        const orderItems = [];
        let totalItems = 0;
        let totalAmount = 0;

        for (const item of cart.items) {
            const product = item.productId;
            if (product) {
                orderItems.push({
                    productID: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    category: product.category,
                    imageURL: product.imageURL
                });

                totalItems += item.quantity;
                totalAmount += product.price * item.quantity;
            }
        }

        // Create Paid Order Document
        const order = await Order.create({
            userId,
            items: orderItems,
            totalAmount,
            totalItems,
            shippingDetails: {
                fullName: fullName || "Customer",
                email: email || "",
                phone: phone || "",
                address: address || "",
                city: city || "",
                postalCode: postalCode || "",
                orderNote: orderNote || ""
            },
            paymentMethod: "Stripe",
            stripeSessionId: session_id,
            paymentStatus: "Paid",
            status: "Pending"
        });

        // Deduct Product Stock
        for (const item of cart.items) {
            if (item.productId) {
                await Product.findByIdAndUpdate(item.productId._id, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        // Clear Cart
        cart.items = [];
        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Payment verified & order placed successfully",
            order
        });

    } catch (error) {
        console.error("Error verifying Stripe session:", error);
        return res.status(500).json({ success: false, message: error.message || "Failed to verify payment" });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.id;

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const { id, role } = req;

        if (role !== "admin" || !id) {
            return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
        }

        const orders = await Order.find()
            .populate("userId", "fullName email role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All orders fetched successfully",
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Error fetching all orders:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id, role } = req;

        if (role !== "admin" || !id) {
            return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
        }

        const orderId = req.params.id;

        const order = await Order.findById(orderId).populate("userId", "fullName email role");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order
        });

    } catch (error) {
        console.error("Error fetching order by ID:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id, role } = req;

        if (role !== "admin" || !id) {
            return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
        }

        const orderId = req.params.id;
        const { status, paymentStatus } = req.body;

        const allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid order status. Allowed statuses are: ${allowedStatuses.join(", ")}`
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // If order status is changed to Cancelled, restore product stock
        if (status === "Cancelled" && order.status !== "Cancelled") {
            for (const item of order.items) {
                if (item.productID) {
                    await Product.findByIdAndUpdate(item.productID, {
                        $inc: { stock: item.quantity }
                    });
                }
            }
        }

        order.status = status;
        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id, role } = req;

        if (role !== "admin" || !id) {
            return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
        }

        const orderId = req.params.id;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Restore product stock if deleting an order that wasn't cancelled or delivered
        if (order.status !== "Cancelled" && order.status !== "Delivered") {
            for (const item of order.items) {
                if (item.productID) {
                    await Product.findByIdAndUpdate(item.productID, {
                        $inc: { stock: item.quantity }
                    });
                }
            }
        }

        await Order.findByIdAndDelete(orderId);

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting order:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
