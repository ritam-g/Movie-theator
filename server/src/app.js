const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const movieRoutes = require("./routes/movie.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const historyRoutes = require("./routes/history.routes");
const adminRoutes = require("./routes/admin.routes");
const { notFoundHandler, errorMiddleware } = require("./middlewares/error.middleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorMiddleware);

module.exports = app;
