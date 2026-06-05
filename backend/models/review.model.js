import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const reviewModel = mongoose.model("reviews", reviewSchema)

export default reviewModel
