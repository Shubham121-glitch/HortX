import React, { useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useUser } from "../../context/userContext"
import "./Notifications.css"

const Notifications = () => {
  const { notifications, setNotifications } = useUser()

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:3000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ))
    } catch (err) {
      console.error(err)
      toast.error("Failed to mark as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.put("http://localhost:3000/api/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      
      setNotifications(notifications.map(n => ({ ...n, read: true })))
      toast.success("All notifications marked as read")
    } catch (err) {
      console.error(err)
      toast.error("Failed to mark all as read")
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:3000/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      
      setNotifications(notifications.filter(n => n._id !== notificationId))
      toast.success("Notification deleted")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete notification")
    }
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="header">
          <h1>Notifications</h1>
          {notifications.some(n => !n.read) && (
            <button onClick={markAllAsRead} className="mark-all-btn">
              Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="no-notifications">
            <h2>No notifications</h2>
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`notification-card ${notification.read ? "read" : "unread"}`}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(notification._id)
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
