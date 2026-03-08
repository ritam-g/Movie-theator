const express = require("express");
const adminController = require("../controllers/admin.controller");
const { authMiddleware, adminOnly } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.post("/movie", adminController.createMovie);
router.put("/movie/:id", adminController.updateMovie);
router.delete("/movie/:id", adminController.deleteMovie);
router.get("/users", adminController.getUsers);
router.patch("/users/ban", adminController.banUser);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
