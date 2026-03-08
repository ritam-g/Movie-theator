const express = require("express");
const favoriteController = require("../controllers/favorite.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add", authMiddleware, favoriteController.addFavorite);
router.delete("/remove", authMiddleware, favoriteController.removeFavorite);
router.get("/", authMiddleware, favoriteController.getFavorites);

module.exports = router;
