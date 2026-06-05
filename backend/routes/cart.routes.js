import { Router } from "express"
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
} from "../controllers/cart.controller.js"

const cartRouter = Router()

cartRouter.get("/", getCart)
cartRouter.post("/add", addToCart)
cartRouter.delete("/remove/:itemId", removeFromCart)
cartRouter.put("/update/:itemId", updateCartItem)
cartRouter.delete("/clear", clearCart)

export default cartRouter
