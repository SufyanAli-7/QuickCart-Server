import mongoose from "mongoose";

const { Schema } = mongoose;


const OrderItemSchema = new Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    imageURL: {
        type: String,
        required: true,
    }
}, { _id: false })


const ShippingDetailsSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    postalCode: {
        type: String,
        required: true,
        trim: true,
    },
    orderNote: {
        type: String,
        required: false,
        trim: true,
    }
}, { _id: false })



const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [OrderItemSchema],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    totalItems: {
        type: Number,
        required: true,
        min: 1
    },
    shippingDetails: {
        type: ShippingDetailsSchema,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Stripe"],
        default: "COD"
    },
    stripeSessionId: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ["Paid", "Pending", "Failed", "Refunded"],
        default: "Pending"
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending"
    }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;