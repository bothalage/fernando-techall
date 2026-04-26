const mongoose = require("mongoose");
module.exports = mongoose.model("Testimonial", new mongoose.Schema({
  name: String,
  company: String,
  message: String,
  avatar: String,
  rating: { type: Number, min: 1, max: 5, default: 5 }
}, { timestamps: true }));
