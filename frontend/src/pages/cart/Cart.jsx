import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useUser } from "../../context/userContext"
import "./Cart.css"

const Cart = () => {
  const { cart, setCart, user } = useUser()
  const navigate = useNavigate()
  const [checkout, setCheckout] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    state: "",
    district: "",
    tehsil: "",
    pin: "",
    contactNumber: ""
  })

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return
    try {
      const res = await axios.put(`http://localhost:3000/api/cart/update/${itemId}`, { quantity }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setCart(res.data.cart)
    } catch (err) {
      console.error(err)
      toast.error("Failed to update cart")
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setCart(res.data.cart)
      toast.success("Item removed from cart")
    } catch (err) {
      console.error(err)
      toast.error("Failed to remove item")
    }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:3000/api/orders/create", {
        shippingAddress: shippingInfo,
        paymentMethod: "Credit Card"
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      toast.success("Order placed successfully!")
      setCart({ ...cart, items: [] })
      navigate("/orders")
    } catch (err) {
      console.error(err)
      toast.error("Failed to place order")
    }
  }

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  if (!cart) {
    return <div className="loading">Loading cart...</div>
  }

  if (!checkout && (!cart.items || cart.items.length === 0)) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items</p>
        <button onClick={() => navigate("/shop")}>Go Shopping</button>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {checkout ? (
          <div className="checkout">
            <h2>Checkout</h2>
            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label>State</label>
                <input
                  required
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>District</label>
                <input
                  required
                  value={shippingInfo.district}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Tehsil</label>
                <input
                  required
                  value={shippingInfo.tehsil}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, tehsil: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>PIN Code</label>
                <input
                  required
                  value={shippingInfo.pin}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, pin: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  required
                  value={shippingInfo.contactNumber}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, contactNumber: e.target.value })}
                />
              </div>

              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-item">
                  <span>Total:</span>
                  <span className="total">₹{calculateTotal()}</span>
                </div>
              </div>

              <div className="checkout-actions">
                <button type="button" onClick={() => setCheckout(false)}>Back</button>
                <button type="submit">Place Order</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="cart-items">
              <h2>Your Cart</h2>
              {cart.items.map((item) => (
                <div key={item._id} className="cart-item">
                  <img 
                    src={`http://localhost:3000${item.product.images[0]}`} 
                    alt={item.product.name}
                  />
                  <div className="item-info">
                    <h3>{item.product.name}</h3>
                    <p className="price">₹{item.product.price}</p>
                  </div>
                  <div className="quantity">
                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="item-total">₹{item.product.price * item.quantity}</div>
                  <button 
                    className="remove"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-item">
                <span>Total:</span>
                <span className="total">₹{calculateTotal()}</span>
              </div>
              <button 
                className="checkout-btn"
                onClick={() => setCheckout(true)}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart
