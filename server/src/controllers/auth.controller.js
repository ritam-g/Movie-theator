const ApiError = require("../utils/apiError");

async function register(req, res, next) {
  try {
    return res.status(501).json({ message: "Register endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    return res.status(501).json({ message: "Login endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function profile(req, res, next) {
  try {
    return res.status(501).json({ message: "Profile endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  profile,
};
