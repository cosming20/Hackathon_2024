const Maze = require("../models/Maze");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createMaze = async (req, res) => {
  const {
    start_x,
    start_y,
    finish_x,
    finish_y,
    dimension_x,
    dimension_y,
    bricks,
  } = req.body;
  if (
    !start_x ||
    !start_y ||
    !finish_x ||
    !finish_y ||
    !dimension_x ||
    !dimension_y ||
    !bricks
  ) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  mazeObject = {
    start_x,
    start_y,
    finish_x,
    finish_y,
    dimension_x,
    dimension_y,
    bricks,
  };
  mazeObject.user = req.user.id;
  console.log(req.user);
  maze = await Maze.create(mazeObject);
  res.status(StatusCodes.CREATED).json({ maze });
};
const getSingleMaze = async (req, res) => {
  res.send("get single maze");
};
const getAllMazeByCurrentUser = async (req, res) => {
  res.send("get maze by current");
};
const getAllMaze = async (req, res) => {
  res.send("get all maze");
};
module.exports = {
  createMaze,
  getAllMaze,
  getAllMazeByCurrentUser,
  getSingleMaze,
};
