import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../../context/userContext'
import axios from 'axios'
import './home.css'
import {
  Search, ArrowRight, Leaf, ShoppingBag, Star, Heart,
  TrendingUp, Sparkles, ChevronRight, Package
} from 'lucide-react'

const Home = () => {
  const navigate = useNavigate()
  const { user, setUser, setLoading } = useUser()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/auth/get-user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
        setUser(res.data.user)
        setLoading(false)
        if (res.data.user.accountType === 'vendor') {
          navigate('/vendor-dashboard')
        }
      } catch (err) {
        console.error(err)
        setLoading(false)
        navigate('/login')
      }
    }

    if (!user) {
      fetchUserData()
    } else if (user.accountType === 'vendor') {
      navigate('/vendor-dashboard')
    }
  }, [navigate, setUser, setLoading, user])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/products?limit=8')
      setProducts(res.data.products || [])
    } catch (err) {
      console.error(err)
    } finally {
      setProductsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/products/categories')
      setCategories(res.data.categories || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const categoryIcons = ['🌿', '🍎', '🌸', '🌾', '🥬', '🌻', '🍇', '🌴']

  if (!user) {
    return (
      <div className="page-loading">
        <div className="loading-spinner large"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
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
            Discover the finest<br />
            <span className="gradient-text">organic products</span>
          </h1>
          <p className="hero-subtitle">
            Shop from verified vendors and bring nature's best to your doorstep. 
            Fresh, sustainable, and delivered with care.
          </p>

          <form onSubmit={handleSearch} className="hero-search">
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search products, vendors, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="home-search-input"
              />
              <button type="submit" className="search-btn" id="home-search-btn">
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* Category Chips */}
          {categories.length > 0 && (
            <div className="category-chips">
              {categories.slice(0, 6).map((cat, i) => (
                <button
                  key={i}
                  className="category-chip"
                  onClick={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)}
                >
                  <span className="chip-emoji">{categoryIcons[i % categoryIcons.length]}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <Package size={22} />
            </div>
            <div>
              <span className="stat-number">500+</span>
              <span className="stat-text">Products</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="stat-number">50+</span>
              <span className="stat-text">Vendors</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <Star size={22} />
            </div>
            <div>
              <span className="stat-number">4.8</span>
              <span className="stat-text">Rating</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <Leaf size={22} />
            </div>
            <div>
              <span className="stat-number">100%</span>
              <span className="stat-text">Organic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="section-container">
            <div className="section-header">
              <div>
                <h2>Popular Categories</h2>
                <p>Browse by what you love</p>
              </div>
              <Link to="/shop" className="see-all-btn">
                See All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="categories-grid">
              {categories.slice(0, 8).map((cat, i) => (
                <div
                  key={i}
                  className="category-card"
                  onClick={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="category-icon-circle">
                    <span>{categoryIcons[i % categoryIcons.length]}</span>
                  </div>
                  <span className="category-name">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="products-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <h2>
                <TrendingUp size={24} className="section-icon" />
                Trending Now
              </h2>
              <p>Fresh picks just for you</p>
            </div>
            <Link to="/shop" className="see-all-btn">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {productsLoading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="product-skeleton">
                  <div className="skeleton" style={{ height: '200px' }}></div>
                  <div className="skeleton" style={{ height: '16px', width: '80%', marginTop: '12px' }}></div>
                  <div className="skeleton" style={{ height: '14px', width: '50%', marginTop: '8px' }}></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <Leaf size={48} />
              <h3>No products yet</h3>
              <p>Products will appear here once vendors start adding them!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.slice(0, 8).map((product, i) => (
                <div
                  key={product._id}
                  className="product-card"
                  onClick={() => navigate(`/product/${product._id}`)}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={`http://localhost:3000${product.images[0]}`}
                      alt={product.name}
                      loading="lazy"
                    />
                    <div className="product-overlay">
                      <button className="quick-view-btn">
                        <span>Quick View</span>
                      </button>
                    </div>
                    <button className="wishlist-btn" onClick={(e) => { e.stopPropagation() }}>
                      <Heart size={16} />
                    </button>
                    {product.stock === 0 && (
                      <span className="out-of-stock-badge">Sold Out</span>
                    )}
                  </div>
                  <div className="product-info">
                    <span className="product-category-tag">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-bottom">
                      <span className="product-price">₹{product.price}</span>
                      {product.vendor && (
                        <span className="vendor-tag">by {product.vendor.username}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to sell your products?</h2>
            <p>Join HortX as a vendor and reach thousands of eco-conscious customers.</p>
            <Link to="/register" className="cta-btn">
              <span>Become a Vendor</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home