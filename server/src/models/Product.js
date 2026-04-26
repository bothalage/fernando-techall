const mongoose = require("mongoose");
module.exports = mongoose.model("Product", new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  price: Number
}, { timestamps: true }));
