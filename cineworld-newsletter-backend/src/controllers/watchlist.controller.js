const Watchlist = require("../models/Watchlist");

exports.addMovie = async (req, res) => {
  try {
    const { movieId, title, poster } = req.body;

    const exists = await Watchlist.findOne({
      userId: req.user.id,
      movieId
    });

    if (exists) {
      return res.status(400).json({ message: "Movie already saved" });
    }

    const movie = await Watchlist.create({
      userId: req.user.id,
      movieId,
      title,
      poster
    });

    res.status(201).json(movie);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const movies = await Watchlist.find({
      userId: req.user.id
    });

    res.json(movies);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeMovie = async (req, res) => {
  try {
    await Watchlist.deleteOne({
      userId: req.user.id,
      movieId: req.params.movieId
    });

    res.json({ message: "Movie removed" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};