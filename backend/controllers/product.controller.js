import productModel from "../models/product.model.js"
import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getVendorFromToken = (req) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return null

  const token = authHeader.split(" ")[1]
  const decoded = jwt.verify(token, config.JWT_SECRET)
  return decoded.id
}

export const createProduct = async (req, res) => {
  try {
    const vendorId = getVendorFromToken(req)
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { name, description, price, category, stock } = req.body

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" })
    }

    const images = req.files.map(file => `/uploads/${file.filename}`)

    const product = await productModel.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock) || 0,
      images,
      vendor: vendorId
    })

    res.status(201).json({
      message: "Product created successfully",
      product
    })
  } catch (err) {
    res.status(500).json({
      message: "Failed to create product",
      error: err.message
    })
  }
}

export const getVendorProducts = async (req, res) => {
  try {
    const vendorId = getVendorFromToken(req)
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const products = await productModel.find({ vendor: vendorId }).populate("vendor", "username email")
    res.status(200).json({
      message: "Products fetched successfully",
      products
    })
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: err.message
    })
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "-1",
      page = 1,
      limit = 12
    } = req.query

    const query = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ]
    }

    if (category) {
      query.category = { $regex: category, $options: "i" }
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const sort = {}
    sort[sortBy] = Number(sortOrder)

    const skip = (Number(page) - 1) * Number(limit)
    const products = await productModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("vendor", "username")

    const totalProducts = await productModel.countDocuments(query)

    res.status(200).json({
      message: "Products fetched successfully",
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / Number(limit)),
      currentPage: Number(page)
    })
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: err.message
    })
  }
}

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await productModel.findById(id).populate("vendor", "username email")
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.status(200).json({
      message: "Product fetched successfully",
      product
    })
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: err.message
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const vendorId = getVendorFromToken(req)
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { id } = req.params
    const product = await productModel.findById(id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (product.vendor.toString() !== vendorId) {
      return res.status(403).json({ message: "You are not authorized to delete this product" })
    }

    product.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, "../", imagePath)
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
    })

    await productModel.findByIdAndDelete(id)

    res.status(200).json({
      message: "Product deleted successfully"
    })
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete product",
      error: err.message
    })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const vendorId = getVendorFromToken(req)
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { id } = req.params
    const { name, description, price, category, stock } = req.body

    const product = await productModel.findById(id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (product.vendor.toString() !== vendorId) {
      return res.status(403).json({ message: "You are not authorized to update this product" })
    }

    let updatedData = {
      name,
      description,
      price,
      category,
      stock
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`)
      updatedData.images = [...product.images, ...newImages]
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true })

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    })
  } catch (err) {
    res.status(500).json({
      message: "Failed to update product",
      error: err.message
    })
  }
}

export const getCategories = async (req, res) => {
  try {
    const products = await productModel.find()
    const categories = [...new Set(products.map(p => p.category))]
    res.status(200).json({ categories })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" })
  }
}
