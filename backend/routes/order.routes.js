import { Router } from "express"
import {
  createOrder,
  getUserOrders,
  getVendorOrders,
  updateOrderItemStatus,
  getVendorAnalytics
} from "../controllers/order.controller.js"

const orderRouter = Router()

orderRouter.post("/create", createOrder)
orderRouter.get("/user", getUserOrders)
orderRouter.get("/vendor", getVendorOrders)
orderRouter.put("/:orderId/item/:itemId/status", updateOrderItemStatus)
orderRouter.get("/analytics", getVendorAnalytics)

export default orderRouter
