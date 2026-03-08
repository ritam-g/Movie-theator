const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
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
