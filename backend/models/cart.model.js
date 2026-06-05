import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }]
}, {
  timestamps: true
})

const cartModel = mongoose.model("carts", cartSchema)

export default cartModel
