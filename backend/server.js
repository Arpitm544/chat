require("dotenv").config()
const express = require("express")
const http = require("http")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./db/mongoose")
const userRoutes = require("./controllers/User.controller")
const messageRoutes = require("./controllers/message_controllers")
const groupRoutes = require('./controllers/group.controller')
const authmiddleware = require("./middleware/authMiddleware")
const { initializeSocket } = require("./lib/socket")

const app = express()
const server = http.createServer(app)
const HEALTHCHECK_INTERVAL_MS = 10 * 60 * 1000

// Middlewares
connectDB()
 
app.set("trust proxy", 1);
const allowedOrigins = [
  "https://chat-ui-hm84.vercel.app",
  "https://chat-ui-hm84-lmbz847l2-arpitm544s-projects.vercel.app",
  "http://localhost:5173",
  ...((process.env.FRONTEND_URL || "").split(",").map((url) => url.trim()).filter(Boolean)),
]
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({ extended: true , limit:'10mb'}))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Backend is running")
})

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})
app.use("/user", userRoutes)
app.use("/messages", authmiddleware, messageRoutes)
app.use('/groups', authmiddleware, groupRoutes)

// Initialize Socket.io using SAME server
initializeSocket(server)

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Set HEALTHCHECK_URL to the deployed service URL (for example,
// https://your-service.onrender.com/health). Render also supplies
// RENDER_EXTERNAL_URL, which works as an automatic fallback there.
const healthcheckUrl = process.env.HEALTHCHECK_URL ||
  (process.env.RENDER_EXTERNAL_URL && `${process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "")}/health`)

const triggerHealthcheck = async () => {
  if (!healthcheckUrl) return
  try {
    const response = await fetch(healthcheckUrl, { signal: AbortSignal.timeout(10_000) })
    if (!response.ok) console.warn(`Health check returned ${response.status}`)
  } catch (error) {
    console.warn("Health check failed:", error.message)
  }
}

if (healthcheckUrl) {
  triggerHealthcheck()
  setInterval(triggerHealthcheck, HEALTHCHECK_INTERVAL_MS)
  console.log(`Health check scheduled every 10 minutes: ${healthcheckUrl}`)
}
