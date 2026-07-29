import Product from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


export const createProduct = async (req, res) => {
    try {

        const { id, role} = req;

        if (role !== "admin" || !id) {
            return res.status(403).json({message: "You are not authorized to create a product"});
        }

        const { name, description, price, stock, category, status = "active" } = req.body;
        const image = req.file;

        if (!name || !description || !price || !stock || !category || !image) {
            return res.status(400).json({message: "All fields are required"});
        }

        let imageURL = '';
        let imagePublicId = '';

        if(image){
            const uploadResult = await uploadOnCloudinary(image.path);
            if(!uploadResult){
                return res.status(500).json({message: "Failed to upload image"});
            }
            imageURL = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }

        const product = await Product.create({
            uid: id,
            name,
            description,
            price,
            stock,
            category,
            imageURL: imageURL,
            imagePublicId: imagePublicId,
            status
        });
        
        return res.status(201).json({success: true, message: "Product created successfully", product});
    }
    catch (error) {
        console.error('Error during product creation:', error.message);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}


export const allProducts = async (req, res) => {
    try {

        const {id, role } = req;

        if(!id || !role){
            return res.status(403).json({message: "You are not authorized to fetch products"});
        }
        
        let products = [];

        if(role === "admin"){
            products = await Product.find();
        }else{
            products = await Product.find({status: "active"});
        }
        
        return res.status(200).json({success: true, message: "Products fetched successfully", products});
    }
    catch (error) {
        console.error('Error during product fetching:', error.message);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}


export const getSingleProduct = async(req, res) => {
    try {

        const {id, role} = req;

        if (role !== 'admin' || !id) {
            return res.status(403).json({message: "You are not authorized to fetch the product"});
        }

        const productId = req.params.id;
        
        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        return res.status(200).json({success: true, message: "Product fetched successfully", product});

    }
    catch (error) {
        console.error('Error during product fetching:', error.message);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}