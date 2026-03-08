async function addFavorite(req, res, next) {
  try {
    return res.status(501).json({ message: "Add favorite endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
    return res.status(501).json({ message: "Remove favorite endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function getFavorites(req, res, next) {
  try {
    return res.status(501).json({ message: "Favorites endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function addHistory(req, res, next) {
  try {
    return res.status(501).json({ message: "Add history endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    return res.status(501).json({ message: "Watch history endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  addHistory,
  getHistory,
};
