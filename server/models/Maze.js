const { required } = require("joi");
const mongoose = require("mongoose");

const mazeSchema = new mongoose.Schema(
  {
    start_x: {
      type: Number,
      required: [true, "Please provide this field"],
      default: 0,
    },
    finish_x: {
      type: Number,
      required: [true, "Please provide this field"],
      default: 0,
    },
    start_y: {
      type: Number,
      required: [true, "Please provide this field"],
      default: 0,
    },
    finish_y: {
      type: Number,
      required: [true, "Please provide this field"],
      default: 0,
    },
    dimension_x: {
      type: Number,
      required: [true, "Please provide this field"],
      default: 0,
    },
    dimension_y: {
      type: Number,
      required: [true, "Please provide this field"],
      default: 0,
    },
    bricks: {
      type: Number,
      required: [true, "Please provide this field"],
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matrix: {
      type: [[Number]],
      default: [[0]],
    },
    matrixSolved: {
      type: [[Number]],
      default: [[0]],
    },
    pathSolved: {
      type: [[Number]],
      default: [[0]],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("maze", mazeSchema);
