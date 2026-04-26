const mongoose = require("mongoose");
module.exports = mongoose.model("ContactMessage", new mongoose.Schema({
  name: String, email: String, subject: String, message: String,
  read: { type: Boolean, default: false }
}, { timestamps: true }));
