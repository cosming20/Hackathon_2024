require("dotenv").config();
require("express-async-errors");
// express

const express = require("express");
const app = express();
const cors = require("cors");
// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// database
const connectDB = require("./db/connect");

//  routers
const authRouter = require("./routes/authRoutes");
const mazeRouter = require("./routes/mazeRoutes");
// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
const corsOptions = {
  origin: "http://localhost:4200", // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/maze", mazeRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
