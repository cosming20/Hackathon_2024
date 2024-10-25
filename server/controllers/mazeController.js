const Maze = require("../models/Maze");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { spawn } = require("child_process");

const solveMaze = async (req, res) => {
  const mazeId = req.params.id;
  const maze = await Maze.findOne({ _id: mazeId });
  if (!maze) {
    throw new CustomError.BadRequestError(`Maze not found with id ${mazeId}`);
  }
  // const python = spawn("python3", ["../../scripts/app.py", start_x,
  //   start_y,
  //   finish_x,
  //   finish_y,
  //   dimension_x,
  //   dimension_y,
  //   bricks] );
  const path = require("path");
  // console.log(maze.matrix);
  const python = spawn("python3", [
    path.resolve(__dirname, "../../scripts/path.py"),
    maze.start_x,
    maze.start_y,
    maze.finish_x,
    maze.finish_y,
    JSON.stringify(maze.matrix),
  ]);
  let matrixSolved = "";
  python.stdout.on("data", (data) => {
    matrixSolved += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });
  python.on("close", async (code) => {
    if (code !== 0) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to generate maze matrix" });
    }
    try {
      // console.log(matrixSolved);
      const parsedMatrix = JSON.parse(matrixSolved); // Parses `matrixSolved` into an array
      console.log(typeof(parsedMatrix))
      if (Array.isArray(parsedMatrix) && Array.isArray(parsedMatrix[1])) {
        maze.matrixSolved = parsedMatrix; // Access the second matrix
        await maze.save();
        res.status(200).json({ maze });
      } else {
        throw new Error("Parsed data structure is invalid");
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to parse matrix data" });
    }
  });
  // add here mazeObject.matrix
  // maze = await Maze.create(mazeObject);
  // res.status(StatusCodes.CREATED).json({ maze });
};

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
    start_x === undefined ||
    start_y === undefined ||
    finish_x === undefined ||
    finish_y === undefined ||
    dimension_x === undefined ||
    dimension_y === undefined ||
    bricks === undefined
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
  // const python = spawn("python3", ["../../scripts/app.py", start_x,
  //   start_y,
  //   finish_x,
  //   finish_y,
  //   dimension_x,
  //   dimension_y,
  //   bricks] );
  const path = require("path");
  const python = spawn("python3", [
    path.resolve(__dirname, "../../scripts/generate.py"),
    start_x,
    start_y,
    finish_x,
    finish_y,
    dimension_x,
    dimension_y,
    bricks,
  ]);
  let matrix = "";
  python.stdout.on("data", (data) => {
    matrix += data.toString();
  });
  // console.log(matrix)
  python.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });
  python.on("close", async (code) => {
    if (code !== 0) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to generate maze matrix" });
    }
    // console.log(matrix);
    try {
      const parsedMatrix = JSON.parse(matrix);
      const mazeObject = {
        start_x,
        start_y,
        finish_x,
        finish_y,
        dimension_x,
        dimension_y,
        bricks,
        matrix: parsedMatrix,
        user: req.user.id,
      };
      const maze = await Maze.create(mazeObject);
      res.status(StatusCodes.CREATED).json({ maze });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to parse matrix data" });
    }
  });
  // add here mazeObject.matrix
  // maze = await Maze.create(mazeObject);
  // res.status(StatusCodes.CREATED).json({ maze });
};

const getSingleMaze = async (req, res) => {
  const mazeId = req.params.id;
  const maze = await Maze.findOne({ _id: mazeId });
  if (!maze) {
    throw new CustomError.NotFoundError(`No maze found with id ${mazeId}`);
  }
  res.status(StatusCodes.OK).json({ maze });
};
const getAllMazeByCurrentUser = async (req, res) => {
  console.log(req.user.id);
  const mazes = await Maze.find({ user: req.user.id });
  if (!mazes) {
    throw new CustomError.NotFoundError(
      `No mazes found for user ${req.user.username}`
    );
  }
  res.status(StatusCodes.OK).json({ mazes, count: mazes.length });
};
const getAllMaze = async (req, res) => {
  const mazes = await Maze.find();
  if (!mazes) {
    throw new CustomError.NotFoundError(`No mazes found`);
  }
  res.status(StatusCodes.OK).json({ mazes, count: mazes.length });
};
module.exports = {
  createMaze,
  getAllMaze,
  getAllMazeByCurrentUser,
  getSingleMaze,
  solveMaze,
};