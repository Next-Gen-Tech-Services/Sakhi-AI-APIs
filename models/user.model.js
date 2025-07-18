const mongoose = require("mongoose");

const { MALE, FEMALE, OTHER } = require("../utils/constants/gender.constant");
const { MOBILE, EMAIL, GOOGLE } = require("../utils/constants/via.constant");


const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: ""
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: false,
      default: "",
      unique: true
    },
    gender: {
      type: String,
      enum: [MALE, FEMALE, OTHER],
      default: MALE
    },
    via: {
      type: String,
      required: true,
      enum: [MOBILE, EMAIL, GOOGLE], // for future proof
    },
    dob: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
