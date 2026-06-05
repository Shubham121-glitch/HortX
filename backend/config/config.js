import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error("MongoUri not defined in env");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in env");
}

const config = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
}

export default config;