const mongoose = require("mongoose");
module.exports = mongoose.model("Service", new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  icon: String,
  price: String
}, { timestamps: true }));
