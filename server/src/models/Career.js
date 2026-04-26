const mongoose = require("mongoose");

module.exports = mongoose.model("Career", new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, unique: true },
  department: { type: String, default: "General" },
  location: { type: String, default: "Remote / Sri Lanka" },
  type: { type: String, enum: ["full_time", "part_time", "contract", "internship"], default: "full_time" },
  experience: { type: String, default: "Mid-level" },
  salary: { type: String, default: "Negotiable" },
  summary: { type: String, default: "" },
  description: { type: String, default: "" },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true }));
