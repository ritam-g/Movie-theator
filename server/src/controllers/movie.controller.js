async function getMovies(req, res, next) {
  try {
    return res.status(501).json({ message: "Movies endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

async function getMovieById(req, res, next) {
  try {
    return res.status(501).json({ message: "Movie details endpoint scaffolded" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMovies,
  getMovieById,
};
