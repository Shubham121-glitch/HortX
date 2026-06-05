import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "./Orders.css"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/orders/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setOrders(res.data.orders)
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    const classes = {
      "Pending": "status-pending",
      "Processing": "status-processing",
      "Shipped": "status-shipped",
      "Out for Delivery": "status-out-for-delivery",
      "Delivered": "status-delivered",
      "Cancelled": "status-cancelled"
    }
    return classes[status] || "status-pending"
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No orders yet</h2>
            <p>Start shopping to place your first order!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">Order #{order._id.slice(-8)}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="order-total">Total: ₹{order.totalAmount}</div>
                </div>
                
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item._id} className="order-item">
                      <img 
                        src={`http://localhost:3000${item.product?.images[0]}`}
                        alt={item.product?.name}
                        className="product-image"
                      />
                      <div className="item-details">
                        <h4>{item.product?.name}</h4>
                        <p>Price: ₹{item.price} × {item.quantity}</p>
                        <p className="item-total">Item Total: ₹{item.price * item.quantity}</p>
                        <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <button 
                        className="toggle-tracking-btn"
                        onClick={() => setExpandedOrder(expandedOrder === item._id ? null : item._id)}
                      >
                        {expandedOrder === item._id ? "Hide Tracking" : "Track Order"}
                      </button>
                    </div>
                  ))}
                </div>

                {order.items.some(item => item._id === expandedOrder) && (
                  <div className="tracking-section">
                    {(() => {
                      const item = order.items.find(i => i._id === expandedOrder)
                      return item?.trackingHistory?.length > 0 ? (
                        <div className="tracking-timeline">
                          <h3>Tracking History</h3>
                          {[...item.trackingHistory].reverse().map((tracking, index) => (
                            <div key={index} className="tracking-event">
                              <div className="tracking-dot"></div>
                              <div className="tracking-info">
                                <p className="tracking-status">{tracking.status}</p>
                                <p className="tracking-description">{tracking.description}</p>
                                {tracking.location && <p className="tracking-location">📍 {tracking.location}</p>}
                                <p className="tracking-date">{new Date(tracking.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-tracking">No tracking information available yet</div>
                      )
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
