import mongoose from "mongoose";

const trackingHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String
  }
});

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending"
  },
  trackingHistory: [trackingHistorySchema]
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    state: String,
    district: String,
    tehsil: String,
    pin: String,
    contactNumber: String
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Completed"
  }
}, {
  timestamps: true
});

const orderModel = mongoose.model("orders", orderSchema);

export default orderModel;
