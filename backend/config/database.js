import mongoose from "mongoose";
import config from "./config.js";

const connectdb = async () => {
    mongoose.connect(config.MONGODB_URI);
    console.log("Database connected!")
}

export default connectdb;