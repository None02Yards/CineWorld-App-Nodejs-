const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  addMovie,
  getWatchlist,
  removeMovie
} = require("../controllers/watchlist.controller");

router.post("/", auth, addMovie);
router.get("/", auth, getWatchlist);
router.delete("/:movieId", auth, removeMovie);

module.exports = router;