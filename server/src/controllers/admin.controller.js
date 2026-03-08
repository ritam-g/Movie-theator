async function createMovie(req, res, next) {
  try {
    return res.status(501).json({ message: "Create movie endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function updateMovie(req, res, next) {
  try {
    return res.status(501).json({ message: "Update movie endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function deleteMovie(req, res, next) {
  try {
    return res.status(501).json({ message: "Delete movie endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    return res.status(501).json({ message: "Get users endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function banUser(req, res, next) {
  try {
    return res.status(501).json({ message: "Ban user endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    return res.status(501).json({ message: "Delete user endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createMovie,
  updateMovie,
  deleteMovie,
  getUsers,
  banUser,
  deleteUser,
};
