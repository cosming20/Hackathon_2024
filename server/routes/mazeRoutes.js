const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");
const {
  createMaze,
  getSingleMaze,
  getAllMazeByCurrentUser,
  getAllMaze,
} = require("../controllers/mazeController");
router.post("/", authenticateUser, createMaze);
router.get("/:id", authenticateUser, getSingleMaze);
router.get("/showMe", authenticateUser, getAllMazeByCurrentUser);
router.get("/", authenticateUser, getAllMaze);
module.exports = router;
