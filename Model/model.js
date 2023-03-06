const mongoose = require("mongoose");

const UserEntry = new mongoose.Schema({
  registerName: {
    type: String,
    required: true,
  },
  registerAge: {
    type: Number,
    required: true,
  },
  registerReferrel: {
    type: String,
    required: true,
  },
  registerPurpose: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  offmail:{
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  in_time: {
    type: Date,
    required: true,
  },
  out_time: {
    type: Date,
  },
  inOut:{
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("UserEntry", UserEntry);
module.exports = { User };
