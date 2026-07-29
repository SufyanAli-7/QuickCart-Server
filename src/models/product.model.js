import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    uid : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 
    name : {
        type: String,
        required: true,
        trim: true,
    },
    description : {
        type: String,
        required: true,
        trim: true,
    },
    price : {
        type: Number,
        required: true,
    },
    stock : {
        type: Number,
        required: true,
    },
    imageURL : {
        type: String,
        required: true,
    },
    imagePublicId : {
        type: String,
        required: true,
    },
    category : {
        type: String,
        enum: ["Electronics","Fashion","Home & Kitchen","Beauty","Sports","Books", "Toys","Groceries", "Health","Automotive","Accessories","Furniture","Stationery","Other"],
        required: true,
    }   
}, {timestamps: true});

const Product = mongoose.model('Product', ProductSchema);

export default Product;