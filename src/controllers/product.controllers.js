import Product from "../models/product.model.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";


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
            userId: id,
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
        const { role } = req;
        
        let products = [];

        if(role === "admin"){
            products = await Product.find().sort({createdAt: -1});
        }else{
            products = await Product.find({status: "active"}).sort({createdAt: -1});
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
        const { role } = req;
        const productId = req.params.id;

        const query = { _id: productId };

        if (role !== 'admin') {
            query.status = 'active';
        }

        const product = await Product.findOne(query);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({ success: true, message: "Product fetched successfully", product });

    }
    catch (error) {
        console.error('Error during product fetching:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const updateProduct = async (req, res) => {
    try {
                
        const { id, role } = req;
        if (role !== 'admin' || !id) {
            return res.status(403).json({ message: 'Access denied. SuperAdmins only.', success: false });
        }
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false });
        }
        const { name, description, price, stock, category, status } = req.body;
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (stock) product.stock = stock;
        if (category) product.category = category;
        if (status) product.status = status;
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (!uploadResult) {
                return res.status(400).json({ success: false, message: "Failed to upload new image" });
            }
            if (product.imagePublicId) {
                await deleteOnCloudinary(product.imagePublicId);
            }
            product.imageURL = uploadResult.secure_url;
            product.imagePublicId = uploadResult.public_id;
        }
        await product.save();
        return res.status(200).json({ success: true, message: 'Product updated successfully', product });
    }
    catch (error) {
        console.error('Error during product update:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } 
}

export const deleteProduct = async (req, res) => {
    try {
        const { id , role } = req;
        if (role !== 'admin' || !id) {
            return res.status(403).json({ message: 'Access denied. SuperAdmins only.', success: false });
        }
        const productId = req.params.id;
        const product = await Product.findById(productId);
 
        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false });
        }

        if (product.imagePublicId) {
            const result = await deleteOnCloudinary(product.imagePublicId);            
            if (!result) {
                return res.status(500).json({message: "Failed to delete image"});
            }
        }

        await Product.findByIdAndDelete( productId );
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error('Error during product deletion:', error.message);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}