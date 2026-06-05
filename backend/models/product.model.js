import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"]
  },
  description: {
    type: String,
    required: [true, "Product description is required"]
  },
  price: {
    type: Number,
    required: [true, "Product price is required"]
  },
  category: {
    type: String,
    required: [true, "Product category is required"]
  },
  images: [{
    type: String,
    required: [true, "Product images are required"]
  }],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "Vendor is required"]
  },
  stock: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const productModel = mongoose.model("products", productSchema);

export default productModel;