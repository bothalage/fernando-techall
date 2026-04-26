const mongoose = require("mongoose");
module.exports = mongoose.model("Portfolio", new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  link: String,
  featured: { type: Boolean, default: false }
}, { timestamps: true }));
