const Maze = require("../models/Maze");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const savePathh = async (lab, start, stop) => {
  const queue = [[start[0], start[1], 0]];
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);
  const previousCell = { [`${start[0]},${start[1]}`]: null };
  const directions = [[-1, 0], [0, -1], [1, 0], [0, 1]];

  while (queue.length > 0) {
    const [x, y, dist] = queue.shift();

    if (x === stop[0] && y === stop[1]) {
      const path = [];
      let cell = `${x},${y}`;

      while (previousCell[cell] !== null) {
        const [px, py] = cell.split(',').map(Number);
        path.push([px, py]);
        cell = previousCell[cell];
      }

      path.push([start[0], start[1]]);
      path.reverse();
      return path;
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && nx < lab.length &&
        ny >= 0 && ny < lab[0].length &&
        !visited.has(`${nx},${ny}`)
      ) {
        if (lab[nx][ny] === 0 || lab[nx][ny] === 3) {
          queue.push([nx, ny, dist + 1]);
          visited.add(`${nx},${ny}`);
          previousCell[`${nx},${ny}`] = `${x},${y}`;
        }
      }
    }
  }

  return null;
};

const generateLab = async (x_start, y_start, x_finish, y_finish, x, y, brick) => {
  if (brick > 40) {
    throw new Error(`Percentage of bricks can't be bigger than 40! Current Percentage: ${brick}`);
  }

  // Initialize an empty labyrinth with zeros
  const lab = Array.from({ length: x }, () => Array(y).fill(0));

  // Mark the start and finish positions
  lab[x_start][y_start] = 2;
  lab[x_finish][y_finish] = 3;

  // Calculate the number of bricks
  let bricks_num = Math.floor((x * y * brick) / 100);

  // Place bricks randomly until we reach the required count
  while (bricks_num > 0) {
    const rand_x = Math.floor(Math.random() * x);
    const rand_y = Math.floor(Math.random() * y);

    if (lab[rand_x][rand_y] === 0) {
      lab[rand_x][rand_y] = 1;
      bricks_num -= 1;
    }
  }

  return lab;
};

const findShortestPath = async (lab, start, stop) => {
  const queue = [[start[0], start[1]]];  // Queue only holds coordinates
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);
  const previousCell = { [`${start[0]},${start[1]}`]: null };
  const directions = [[-1, 0], [0, -1], [1, 0], [0, 1]];

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    // Check if we've reached the stop position
    if (x === stop[0] && y === stop[1]) {
      const path = [];
      let cell = `${x},${y}`;

      // Backtrack to form the path
      while (previousCell[cell] !== null) {
        const [px, py] = cell.split(',').map(Number);

        // Only mark path cells, excluding the start and stop cells
        if ((px !== start[0] || py !== start[1]) && (px !== stop[0] || py !== stop[1])) {
          lab[px][py] = 4;  // Mark the path in the lab with '4'
        }
        
        path.push([px, py]);
        cell = previousCell[cell];
      }

      path.push([start[0], start[1]]);
      path.reverse();  // Reverse to get path from start to stop
      return lab;
    }

    // Explore neighboring cells
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      // Check if the new cell is within bounds, has not been visited, and is passable
      if (
        nx >= 0 && nx < lab.length &&
        ny >= 0 && ny < lab[0].length &&
        !visited.has(`${nx},${ny}`)
      ) {
        if (lab[nx][ny] === 0 || lab[nx][ny] === 3) {  // Path is open or stop cell
          queue.push([nx, ny]);  // Only add coordinates to queue
          visited.add(`${nx},${ny}`);
          previousCell[`${nx},${ny}`] = `${x},${y}`;
        }
      }
    }
  }

  return null;  // No path found
};

const savePath = async (req, res) => {
  const mazeId = req.params.id;
  const maze = await Maze.findOne({ _id: mazeId });
  if (!maze) {
    throw new CustomError.BadRequestError(`Maze not found with id ${mazeId}`);
  }
  const pathSolved = await savePathh(maze.matrix,[maze.start_x,maze.start_y],[maze.finish_x,maze.finish_y])
  try {
    
    
    const parsedMatrix = pathSolved; // Parses `matrixSolved` into an array
    
    if (Array.isArray(parsedMatrix) && Array.isArray(parsedMatrix[1])) {
      maze.pathSolved = parsedMatrix; // Access the second matrix
      maze.isSolved = true;
      await maze.save();
      res.status(200).json({ maze });
    } else {
      throw new Error("Parsed data structure is invalid");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to parse matrix data" });
  }
}


const solveMaze = async (req, res) => {
  const mazeId = req.params.id;
  const maze = await Maze.findOne({ _id: mazeId });
  if (!maze) {
    throw new CustomError.BadRequestError(`Maze not found with id ${mazeId}`);
  }
  if(maze.isSolved){
    throw new CustomError.BadRequestError(`Maze with id ${mazeId} is already solved`);
  }
  const pathSolved = await findShortestPath(maze.matrix,[maze.start_x,maze.start_y],[maze.finish_x,maze.finish_y])
  // console.log(pathSolved)
  try {
    
    const parsedMatrix = pathSolved; // Parses `matrixSolved` into an array
    if (Array.isArray(parsedMatrix) && Array.isArray(parsedMatrix[1])) {
      maze.matrixSolved = parsedMatrix; // Access the second matrix
      maze.isSolved = true;
      await maze.save();
      res.status(200).json({ maze });
    } else {
      throw new Error("Parsed data structure is invalid");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to parse matrix data" });
  }
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
  const matrix = await generateLab(start_x,start_y,finish_x,finish_y,dimension_x,dimension_y,bricks);
  try {
    // const parsedMatrix = JSON.parse(matrix);
    const mazeObject = {
      start_x,
      start_y,
      finish_x,
      finish_y,
      dimension_x,
      dimension_y,
      bricks,
      matrix: matrix,
      user: req.user.id,
    };
    const maze = await Maze.create(mazeObject);
    res.status(StatusCodes.CREATED).json({ maze });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to parse matrix data" });
  }
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
  const { page = 1, limit = 3 } = req.query; // Default to page 1, 10 items per page
  const userId = req.user.id;

  // Calculate the number of documents to skip based on the current page
  const skip = (page - 1) * limit;

  const mazes = await Maze.find({ user: userId })
    .limit(Number(limit))
    .skip(Number(skip));

  if (!mazes || mazes.length === 0) {
    throw new CustomError.NotFoundError(
      `No mazes found for user ${req.user.username}`
    );
  }

  const totalMazes = await Maze.countDocuments({ user: userId });
  const totalPages = Math.ceil(totalMazes / limit);

  res.status(StatusCodes.OK).json({
    mazes,
    count: mazes.length,
    totalMazes,
    totalPages,
    currentPage: parseInt(page),
  });
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
  savePath,
};