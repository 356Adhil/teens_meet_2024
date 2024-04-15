const { timeStamp } = require("console");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const delegateSchema = new Schema(
  {
    full_name: {
      type: String,
    },
    mobile: {
      type: String,
      match: /^[0-9]{10}$/,
    },
    parent_name: {
      type: String,
    },
    parent_mobile: {
      type: String,
      match: /^[0-9]{10}$/,
    },
    email: {
      type: String,
    },
    class: {
      type: String,
    },
    age: {
      type: String,
    },
    place: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Delegates = mongoose.model("Delegates", delegateSchema);

module.exports = Delegates;
