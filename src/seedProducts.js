import mongoose from "mongoose";
import config from "./config/config.js";
import Product from "./models/product.model.js";
import User from "./models/user.model.js";

const sampleProducts = [
    {
        name: "Wireless Noise-Canceling Headphones",
        description: "Premium over-ear headphones with active noise-canceling technology, 30-hour battery life, and crystal-clear sound quality.",
        price: 14999,
        stock: 25,
        category: "Electronics",
        imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
        imagePublicId: "seed_sample_headphone_1",
        status: "active"
    },
    {
        name: "Ultra-Slim Smartwatch Series 7",
        description: "Modern smartwatch featuring heart rate monitoring, fitness tracking, GPS, and a sleek AMOLED display.",
        price: 9999,
        stock: 40,
        category: "Electronics",
        imageURL: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60",
        imagePublicId: "seed_sample_watch_2",
        status: "active"
    },
    {
        name: "Classic Men's Leather Jacket",
        description: "Handcrafted genuine leather jacket with soft lining, heavy-duty zippers, and a timeless biker style.",
        price: 12500,
        stock: 15,
        category: "Fashion",
        imageURL: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=60",
        imagePublicId: "seed_sample_jacket_3",
        status: "active"
    },
    {
        name: "Ergonomic Mesh Office Chair",
        description: "High-back breathable mesh chair with adjustable lumbar support, 3D armrests, and 360-degree swivel wheels.",
        price: 18500,
        stock: 10,
        category: "Furniture",
        imageURL: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&auto=format&fit=crop&q=60",
        imagePublicId: "seed_sample_chair_4",
        status: "active"
    },
    {
        name: "Stainless Steel Electric Kettle 1.7L",
        description: "Fast-boiling cordless electric kettle with automatic shut-off and boil-dry protection.",
        price: 3499,
        stock: 50,
        category: "Home & Kitchen",
        imageURL: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?w=800&auto=format&fit=crop&q=60",
        imagePublicId: "seed_sample_kettle_5",
        status: "active"
    },
    {
        name: "Professional Camera Lens 50mm f/1.8",
        description: "Compact prime lens delivering stunning bokeh, sharp portraits, and exceptional low-light performance.",
        price: 24999,
        stock: 8,
        category: "Electronics",
        imageURL: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=60",
        imagePublicId: "seed_sample_lens_6",
        status: "active"
    },
    {
        name: "Organic Vitamin C Face Serum",
        description: "Nourishing facial serum infused with Vitamin C and Hyaluronic Acid for radiant, hydrated, and youthful skin.",
        price: 2199,
        stock: 60,
        category: "Beauty",
        imageURL: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60",
        imagePublicId: "seed_sample_serum_7",
        status: "active"
    },
    {
        name: "Pro Lightweight Running Shoes",
        description: "Breathable mesh running shoes with cushioned foam midsoles for high performance and daily comfort.",
        price: 7999,
        stock: 30,
        category: "Sports",
        imageURL: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60",
        imagePublicId: "seed_sample_shoes_8",
        status: "active"
    },
    {
        name: "Minimalist Wooden LED Desk Lamp",
        description: "Eco-friendly wooden desk lamp with touch controls, 3 brightness levels, and eye-caring warm LED illumination.",
        price: 2899,
        stock: 20,
        category: "Home & Kitchen",
        imageURL: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=60",
        imagePublicId: "seed_sample_lamp_9",
        status: "active"
    },
    {
        name: "Pro Gaming RGB Mechanical Keyboard",
        description: "Tactile mechanical keyboard with customizable RGB backlighting, anti-ghosting keys, and durable aluminum frame.",
        price: 6499,
        stock: 35,
        category: "Electronics",
        imageURL: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60",
        imagePublicId: "seed_sample_keyboard_10",
        status: "active"
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(`${config.MONGO_URI}/ecommerce_smit`);
        console.log("Connected to MongoDB successfully");

        // Find existing admin or any user to assign as userId
        let adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) {
            adminUser = await User.findOne();
        }

        if (!adminUser) {
            console.log("No user found in DB. Creating a default Admin user for products...");
            adminUser = await User.create({
                fullName: "admin_seed",
                email: "admin_seed@example.com",
                password: "$2a$10$dummyhashedpasswordforseedonly",
                role: "admin"
            });
        }

        // Attach userId to each sample product
        const productsToInsert = sampleProducts.map(prod => ({
            ...prod,
            userId: adminUser._id
        }));

        // NO DELETE: Insert products into DB without removing existing records
        const insertedProducts = await Product.insertMany(productsToInsert);
        console.log(`Successfully added ${insertedProducts.length} new products to database without deleting existing products!`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding products:", error);
        process.exit(1);
    }
};

seedProducts();
