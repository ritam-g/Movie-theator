const express = require("express");
const favoriteController = require("../controllers/favorite.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add", authMiddleware, favoriteController.addHistory);
router.get("/", authMiddleware, favoriteController.getHistory);

module.exports = router;
