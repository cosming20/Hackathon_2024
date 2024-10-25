const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");
const {
  createMaze,
  getSingleMaze,
  getAllMazeByCurrentUser,
  getAllMaze,
  solveMaze,
  savePath
} = require("../controllers/mazeController");
router.post("/generate", authenticateUser, createMaze);
router.post("/solve/:id", authenticateUser, solveMaze);
router.post("/solve/save/:id", authenticateUser, savePath);
router.get("/showMe", authenticateUser, getAllMazeByCurrentUser);
router.get("/:id", authenticateUser, getSingleMaze);
router.get("/", authenticateUser, getAllMaze);
module.exports = router;