import { Router } from "express"
import {
  createProduct,
  getVendorProducts,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getCategories
} from "../controllers/product.controller.js"
import upload from "../middleware/multer.js"

const productRouter = Router()

productRouter.post("/create", upload.array("images", 10), createProduct)
productRouter.get("/vendor-products", getVendorProducts)
productRouter.get("/", getAllProducts)
productRouter.get("/categories", getCategories)
productRouter.get("/:id", getProductById)
productRouter.delete("/delete/:id", deleteProduct)
productRouter.put("/update/:id", upload.array("images", 10), updateProduct)

export default productRouter
