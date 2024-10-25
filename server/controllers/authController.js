const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { attachSingleCookiesToResponse } = require("../utils/jwt");

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequestError("Please provide username and password");
  }
  console.log(username, password);
  const usernameAlreadyExists = await User.findOne({ username });
  if (usernameAlreadyExists) {
    throw new BadRequestError("Username already exists");
  }
  const user = await User.create({ username, password });

  attachSingleCookiesToResponse({
    res,
    user: { username: user.username, id: user._id },
  });

  res.status(StatusCodes.CREATED).json({ user: { username: user.username } });
};
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("Please provide username and password");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  attachSingleCookiesToResponse({
    res,
    user: { username: user.username, id: user._id },
  });
  res
    .status(StatusCodes.OK)
    .json({ user: { username: user.username, name: user.name } });
};
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
module.exports = {
  register,
  login,
  logout,
};
