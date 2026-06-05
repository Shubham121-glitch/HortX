import express from "express"
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js"
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import orderRouter from "./routes/order.routes.js"
import wishlistRouter from "./routes/wishlist.routes.js"
import reviewRouter from "./routes/review.routes.js"
import notificationRouter from "./routes/notification.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(cookieParser())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/orders", orderRouter)
app.use("/api/wishlist", wishlistRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/notifications", notificationRouter)

export default app
