import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useUser } from "../../context/userContext"
import "./ProductDetail.css"

const ProductDetail = () => {
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const { id } = useParams()
  const { setCart } = useUser()

  useEffect(() => {
    fetchProduct()
    fetchReviews()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/products/${id}`)
      setProduct(res.data.product)
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch product")
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/reviews/product/${id}`)
      setReviews(res.data.reviews)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddToCart = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/cart/add", { productId: id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setCart(res.data.cart)
      toast.success("Item added to cart!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to add item to cart")
    }
  }

  const handleAddToWishlist = async () => {
    try {
      await axios.post("http://localhost:3000/api/wishlist/add", { productId: id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      toast.success("Item added to wishlist!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to add item to wishlist")
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:3000/api/reviews/add", {
        productId: id,
        ...newReview
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setReviews([...reviews, res.data.review])
      setNewReview({ rating: 5, comment: "" })
      toast.success("Review added successfully!")
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to add review")
    }
  }

  if (loading) {
    return <div className="loading">Loading product...</div>
  }

  if (!product) {
    return <div className="error">Product not found</div>
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-main">
          <div className="product-images">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:3000${img}`}
                alt={product.name}
                className={i === 0 ? "main-image" : "thumbnail"}
              />
            ))}
          </div>

          <div className="product-details">
            <h1>{product.name}</h1>
            <div className="rating">
              <span className="stars">
                {"⭐".repeat(Math.round(avgRating))}
                {"☆".repeat(5 - Math.round(avgRating))}
              </span>
              <span className="rating-text">
                {avgRating} ({reviews.length} reviews)
              </span>
            </div>

            <p className="price">₹{product.price}</p>
            <p className="category">Category: {product.category}</p>
            <p className={`stock ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>
            <p className="description">{product.description}</p>

            <div className="actions">
              <button
                className="add-to-cart"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button className="add-to-wishlist" onClick={handleAddToWishlist}>
                ❤️ Add to Wishlist
              </button>
            </div>

            <div className="vendor-info">
              <h4>Sold by:</h4>
              <p>{product.vendor?.username}</p>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          
          <form onSubmit={handleSubmitReview} className="review-form">
            <h3>Add a Review</h3>
            <div className="form-group">
              <label>Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>{num} Star{num > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea
                required
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows="4"
              />
            </div>
            <button type="submit">Submit Review</button>
          </form>

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p>No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <span className="reviewer">{review.user?.username}</span>
                    <span className="review-stars">
                      {"⭐".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
