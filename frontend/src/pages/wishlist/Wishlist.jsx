import React from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useUser } from "../../context/userContext"
import "./Wishlist.css"

const Wishlist = () => {
  const { wishlist, setWishlist, setCart } = useUser()
  const navigate = useNavigate()

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setWishlist(res.data.wishlist)
      toast.success("Item removed from wishlist")
    } catch (err) {
      console.error(err)
      toast.error("Failed to remove item")
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

  if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="empty-wishlist">
        <h2>Your wishlist is empty</h2>
        <p>Start shopping to add items</p>
        <button onClick={() => navigate("/shop")}>Go Shopping</button>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h1>Your Wishlist</h1>
        <div className="wishlist-grid">
          {wishlist.products.map((product) => (
            <div key={product._id} className="wishlist-item">
              <img
                src={`http://localhost:3000${product.images[0]}`}
                alt={product.name}
                onClick={() => navigate(`/product/${product._id}`)}
              />
              <div className="item-info">
                <h3 onClick={() => navigate(`/product/${product._id}`)}>
                  {product.name}
                </h3>
                <p className="price">₹{product.price}</p>
                <div className="item-actions">
                  <button 
                    className="add-to-cart"
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                  <button
                    className="remove"
                    onClick={() => handleRemoveFromWishlist(product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
