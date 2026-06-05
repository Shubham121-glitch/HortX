import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useUser } from "../../context/userContext"
import "./Shop.css"

const Shop = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "-1",
    page: 1
  })
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 })
  const { setCart } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products/categories")
      setCategories(res.data.categories)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {}
      Object.keys(filters).forEach(key => {
        if (filters[key]) params[key] = filters[key]
      })

      const res = await axios.get("http://localhost:3000/api/products", { params })
      setProducts(res.data.products)
      setPagination({
        totalPages: res.data.totalPages,
        currentPage: res.data.currentPage
      })
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      const res = await axios.post("http://localhost:3000/api/cart/add", { productId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setCart(res.data.cart)
      toast.success("Item added to cart!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to add item to cart")
    }
  }

  const handleAddToWishlist = async (productId) => {
    try {
      const res = await axios.post("http://localhost:3000/api/wishlist/add", { productId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      toast.success("Item added to wishlist!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to add item to wishlist")
    }
  }

  return (
    <div className="shop-page">
      <div className="shop-container">
        <div className="sidebar">
          <h2>Filters</h2>
          
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              placeholder="Search products..."
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
            >
              <option value="">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value, page: 1 })}
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value, page: 1 })}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-")
                setFilters({ ...filters, sortBy, sortOrder, page: 1 })
              }}
            >
              <option value="createdAt--1">Newest First</option>
              <option value="createdAt-1">Oldest First</option>
              <option value="price-1">Price: Low to High</option>
              <option value="price--1">Price: High to Low</option>
            </select>
          </div>

          <button 
            className="clear-filters"
            onClick={() => setFilters({
              search: "",
              category: "",
              minPrice: "",
              maxPrice: "",
              sortBy: "createdAt",
              sortOrder: "-1",
              page: 1
            })}
          >
            Clear Filters
          </button>
        </div>

        <div className="products-area">
          <div className="products-grid">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-products">No products found</div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="product-card">
                  <img 
                    src={`http://localhost:3000${product.images[0]}`} 
                    alt={product.name}
                    className="product-image"
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                  <div className="product-info">
                    <h3 onClick={() => navigate(`/product/${product._id}`)}>{product.name}</h3>
                    <p className="product-price">₹{product.price}</p>
                    <p className="product-category">{product.category}</p>
                    <div className="product-actions">
                      <button 
                        className="add-to-cart"
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                      <button 
                        className="add-to-wishlist"
                        onClick={() => handleAddToWishlist(product._id)}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && products.length > 0 && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
              >
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop
