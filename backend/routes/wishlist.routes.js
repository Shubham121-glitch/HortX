import { Router } from "express"
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from "../controllers/wishlist.controller.js"

const wishlistRouter = Router()

wishlistRouter.get("/", getWishlist)
wishlistRouter.post("/add", addToWishlist)
wishlistRouter.delete("/remove/:productId", removeFromWishlist)

export default wishlistRouter
