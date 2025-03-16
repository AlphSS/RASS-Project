const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;