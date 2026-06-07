import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { useUser } from "../../context/userContext"
import {
  Search, Filter, ShoppingCart, Heart, TrendingUp,
  Sparkles, Leaf, Star, ChevronRight, ChevronLeft, SlidersHorizontal, X
} from 'lucide-react'
import "./Shop.css"

const Shop = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  
  const [filters, setFilters] = useState({
    search: new URLSearchParams(location.search).get('search') || "",
    category: new URLSearchParams(location.search).get('category') || "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "-1",
    page: 1
  })
  
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 })
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isHoveringSlider, setIsHoveringSlider] = useState(false)
  const sliderRef = React.useRef(null)
  const { setCart, wishlist, setWishlist, user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
    fetchFeatured()
  }, [])

  const fetchFeatured = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products")
      const shuffled = res.data.products.sort(() => 0.5 - Math.random())
      setFeaturedProducts(shuffled.slice(0, 8)) // Get a few more for the slider
    } catch (err) {
      console.error(err)
    }
  }

  // Continuous auto-scroll logic for the featured slider
  const animationRef = React.useRef(null)
  
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || featuredProducts.length === 0) return;

    const scrollStep = () => {
      if (!isHoveringSlider) {
        slider.scrollLeft += 1; // Speed of scroll
        // If we've scrolled past half the content (which is duplicated), snap back to start
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(scrollStep);
    };

    animationRef.current = requestAnimationFrame(scrollStep);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [featuredProducts, isHoveringSlider]);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  useEffect(() => {
    fetchProducts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const res = await axios.post("http://localhost:3000/api/cart/add", { productId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setCart(res.data.cart)
      toast.success("Added to cart! 🛒")
    } catch (err) {
      console.error(err)
      toast.error("Failed to add to cart")
    }
  }

  const handleAddToWishlist = async (e, productId) => {
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const res = await axios.post("http://localhost:3000/api/wishlist/add", { productId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setWishlist(res.data.wishlist)
      toast.success("Added to wishlist! ❤️")
    } catch (err) {
      console.error(err)
      toast.error("Failed to add to wishlist")
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setFilters({ ...filters, page: 1 })
  }

  const isProductInWishlist = (productId) => {
    return wishlist?.products?.some(p => p._id === productId) || false
  }

  return (
    <div className="shop-page">
      {/* Hero Section */}
      <section className="shop-hero">
        <div className="hero-bg-shapes">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Fresh from Nature</span>
          </div>
          <h1 className="hero-title">
            Discover nature's finest<br />
            <span className="gradient-text">organic products</span>
          </h1>
          <p className="hero-subtitle">
            Shop from verified vendors and bring sustainability to your doorstep.
          </p>

          <form onSubmit={handleSearchSubmit} className="hero-search">
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search for plants, seeds, tools..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <button type="submit" className="search-btn">
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Slider Section */}
      {featuredProducts.length > 0 && (
        <section className="featured-slider-section">
          <div className="slider-header">
            <h2><Sparkles size={22} className="text-primary-500" /> Featured Picks</h2>
            <div className="slider-controls">
              <button className="slider-btn" onClick={() => scrollSlider('left')} aria-label="Scroll left">
                <ChevronLeft size={20} />
              </button>
              <button className="slider-btn" onClick={() => scrollSlider('right')} aria-label="Scroll right">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div 
            className="slider-container" 
            ref={sliderRef}
            onMouseEnter={() => setIsHoveringSlider(true)}
            onMouseLeave={() => setIsHoveringSlider(false)}
            onTouchStart={() => setIsHoveringSlider(true)}
            onTouchEnd={() => setIsHoveringSlider(false)}
          >
            <div className="slider-track">
              {/* Duplicate the array to create a seamless infinite loop */}
              {[...featuredProducts, ...featuredProducts].map((product, index) => (
                <div key={`${product._id}-${index}`} className="slider-card" onClick={() => navigate(`/product/${product._id}`)}>
                  <div className="slider-card-image">
                    <img src={`http://localhost:3000${product.images[0]}`} alt={product.name} />
                    {product.stock === 0 && <span className="slider-badge-out">Sold Out</span>}
                  </div>
                  <div className="slider-info">
                    <span className="slider-category">{product.category}</span>
                    <h4>{product.name}</h4>
                    <div className="slider-price-row">
                      <p>₹{product.price}</p>
                      <button 
                        className="slider-add-btn" 
                        onClick={(e) => handleAddToCart(e, product._id)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="shop-layout">
        {/* Mobile Filters Toggle */}
        <button 
          className="mobile-filters-btn"
          onClick={() => setShowMobileFilters(true)}
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </button>

        {/* Filters Sidebar */}
        <div className={`shop-sidebar ${showMobileFilters ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="close-filters" onClick={() => setShowMobileFilters(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <div className="category-list">
              <button
                className={`category-btn ${filters.category === "" ? "active" : ""}`}
                onClick={() => setFilters({ ...filters, category: "", page: 1 })}
              >
                All Categories
              </button>
              {categories.map((cat, i) => (
                <button
                  key={i}
                  className={`category-btn ${filters.category === cat ? "active" : ""}`}
                  onClick={() => setFilters({ ...filters, category: cat, page: 1 })}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <div className="price-input">
                <span>₹</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value, page: 1 })}
                />
              </div>
              <span className="price-separator">-</span>
              <div className="price-input">
                <span>₹</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value, page: 1 })}
                />
              </div>
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <div className="custom-select">
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-")
                  setFilters({ ...filters, sortBy, sortOrder, page: 1 })
                }}
              >
                <option value="createdAt--1">Newest Arrivals</option>
                <option value="createdAt-1">Oldest First</option>
                <option value="price-1">Price: Low to High</option>
                <option value="price--1">Price: High to Low</option>
              </select>
            </div>
          </div>

          <button 
            className="clear-filters-btn"
            onClick={() => setFilters({
              search: "", category: "", minPrice: "", maxPrice: "",
              sortBy: "createdAt", sortOrder: "-1", page: 1
            })}
          >
            Clear All Filters
          </button>
        </div>

        {/* Mobile Overlay */}
        {showMobileFilters && (
          <div className="filters-overlay" onClick={() => setShowMobileFilters(false)}></div>
        )}

        {/* Main Content */}
        <div className="shop-main">
          <div className="results-header">
            <h2>{filters.category || "All Products"}</h2>
            <span className="results-count">
              {loading ? "Loading..." : `Showing results page ${pagination.currentPage}`}
            </span>
          </div>

          <div className="products-grid">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="product-skeleton">
                  <div className="skeleton img-skeleton"></div>
                  <div className="skeleton text-skeleton"></div>
                  <div className="skeleton text-skeleton short"></div>
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="no-products">
                <div className="no-products-icon">
                  <Leaf size={48} />
                </div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query.</p>
                <button 
                  className="reset-btn"
                  onClick={() => setFilters({
                    search: "", category: "", minPrice: "", maxPrice: "",
                    sortBy: "createdAt", sortOrder: "-1", page: 1
                  })}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              products.map((product, i) => (
                <div 
                  key={product._id} 
                  className="product-card"
                  onClick={() => navigate(`/product/${product._id}`)}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="product-image-container">
                    <img 
                      src={`http://localhost:3000${product.images[0]}`} 
                      alt={product.name}
                      loading="lazy"
                    />
                    {product.stock === 0 && (
                      <div className="stock-badge out">Sold Out</div>
                    )}
                    <button 
                      className={`card-wishlist-btn ${isProductInWishlist(product._id) ? 'active' : ''}`}
                      onClick={(e) => handleAddToWishlist(e, product._id)}
                    >
                      <Heart size={18} fill={isProductInWishlist(product._id) ? "currentColor" : "none"} />
                    </button>
                    
                    <div className="card-actions-overlay">
                      <button 
                        className="quick-add-btn"
                        onClick={(e) => handleAddToCart(e, product._id)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart size={16} />
                        <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <div className="product-meta">
                      <span className="category-tag">{product.category}</span>
                      {product.vendor && <span className="vendor-tag">by {product.vendor.username}</span>}
                    </div>
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-price-row">
                      <span className="price">₹{product.price}</span>
                      <div className="rating">
                        <Star size={14} className="star-icon" fill="currentColor" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && products.length > 0 && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={pagination.currentPage === 1}
                onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`page-num ${pagination.currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, page: i + 1 })}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="page-btn"
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
