const mongoose = require("mongoose");

const Login = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  changepw: {
    type: Boolean,
    default: false,
  },
});

const LoginModel = mongoose.model("Login", Login);
module.exports = { LoginModel };
