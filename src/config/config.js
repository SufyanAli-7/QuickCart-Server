import dotenv from "dotenv";
dotenv.config();


if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}
if (!process.env.PORT) {
    throw new Error("PORT is not defined in the environment variables");
}
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined in the environment variables");
}
if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME is not defined in the environment variables");
}
if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("CLOUDINARY_API_KEY is not defined in the environment variables");
}
if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_SECRET is not defined in the environment variables");
}
if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not defined in the environment variables");
}
if (!process.env.SMTP_USER) {
    throw new Error("SMTP_USER is not defined in the environment variables");
}
if (!process.env.SMTP_PASS) {
    throw new Error("SMTP_PASS is not defined in the environment variables");
}
if (!process.env.SENDER_EMAIL) {
    throw new Error("SENDER_EMAIL is not defined in the environment variables");
}
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined in the environment variables");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in the environment variables");
}
if (!process.env.GOOGLE_CALLBACK) {
    throw new Error("GOOGLE_CALLBACK is not defined in the environment variables");
}
if (!process.env.FAILURE_URL) {
    throw new Error("FAILURE_URL is not defined in the environment variables");
}
if (!process.env.SUCCESS_URL) {
    throw new Error("SUCCESS_URL is not defined in the environment variables");
}

const config = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SENDER_EMAIL: process.env.SENDER_EMAIL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK: process.env.GOOGLE_CALLBACK,
    FAILURE_URL: process.env.FAILURE_URL,
    SUCCESS_URL: process.env.SUCCESS_URL,
};

export default config;