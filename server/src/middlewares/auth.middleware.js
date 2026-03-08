const { verifyToken } = require("../utils/jwt");
const User = require("../models/User.model");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = verifyToken(token);
    const userId = decoded?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const user = await User.findById(userId).select("name email isAdmin isBanned");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "This account is banned" });
    }

    req.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isBanned: user.isBanned,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function adminOnly(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  return next();
}

module.exports = {
  authMiddleware,
  adminOnly,
};
