const mongoose = require("mongoose");

const EmpInfo = new mongoose.Schema({
    Name: {
      type: String,
      required: true,
    },
    phNum: {
        type: Number,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    offmail:{
        type: String,
        default: true,
    },
});

const Employee = mongoose.model("EmpInfo", EmpInfo);
module.exports = { Employee };
