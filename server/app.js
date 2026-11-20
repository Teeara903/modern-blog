const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as server health checks.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

// Middleware
app.use(express.json({ limit: "1mb" }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
// Basic test route
app.get("/", (req, res) => {
  res.json({
    message: "THE DAILY EDIT API is running!",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "healthy" : "unhealthy",
    server: "running",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON request body.",
    });
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "This origin is not allowed.",
    });
  }

  console.error("Server error:", err.message);

  res.status(500).json({
    message: "An unexpected server error occurred.",
  });
});

// Connect to MongoDB before starting server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
