import { Router } from "express"
import {
  getProductReviews,
  addReview,
  deleteReview
} from "../controllers/review.controller.js"

const reviewRouter = Router()

reviewRouter.get("/product/:productId", getProductReviews)
reviewRouter.post("/add", addReview)
reviewRouter.delete("/:reviewId", deleteReview)

export default reviewRouter
