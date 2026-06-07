import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { useUser } from "../../context/userContext"
import { 
  Bell, Package, Tag, AlertCircle, CheckCircle2,
  Trash2, MailOpen, Clock
} from "lucide-react"
import "./Notifications.css"

const Notifications = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate("/login")
    } else {
      fetchNotifications()
    }
  }, [user, navigate])

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setNotifications(res.data.notifications)
    } catch (err) {
      toast.error("Failed to fetch notifications")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ))
    } catch (err) {
      toast.error("Failed to update notification")
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.put("http://localhost:3000/api/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
      toast.success("All caught up! ✨")
    } catch (err) {
      toast.error("Failed to update notifications")
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "ORDER_UPDATE": return <Package size={20} className="icon-order" />
      case "PROMOTION": return <Tag size={20} className="icon-promo" />
      case "SYSTEM": return <AlertCircle size={20} className="icon-system" />
      case "SUCCESS": return <CheckCircle2 size={20} className="icon-success" />
      default: return <Bell size={20} className="icon-default" />
    }
  }

  if (loading) return (
    <div className="page-loading">
      <div className="loading-spinner large"></div>
    </div>
  )

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <div>
            <h1 className="page-title">
              <Bell className="title-icon" />
              Notifications
            </h1>
            <p className="notifications-subtitle">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button className="mark-all-read-btn" onClick={markAllAsRead}>
              <MailOpen size={16} />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <div className="empty-icon-wrapper">
              <Bell size={60} />
            </div>
            <h2>You're all caught up!</h2>
            <p>There are no new notifications at the moment. We'll let you know when something important happens.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notif, i) => (
              <div 
                key={notif._id} 
                className={`notification-card ${!notif.isRead ? 'unread' : 'read'}`}
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => !notif.isRead && markAsRead(notif._id)}
              >
                {!notif.isRead && <div className="unread-dot"></div>}
                
                <div className={`notification-icon-wrapper type-${notif.type.toLowerCase()}`}>
                  {getNotificationIcon(notif.type)}
                </div>
                
                <div className="notification-content">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <span className="notification-time">
                    <Clock size={12} />
                    {new Date(notif.createdAt).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
