const mongoose = require("mongoose");

module.exports = mongoose.model("CareerApplication", new mongoose.Schema({
  career: { type: mongoose.Schema.Types.ObjectId, ref: "Career", required: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  portfolioUrl: { type: String, default: "" },
  resumeUrl: { type: String, default: "" },
  coverLetter: { type: String, default: "" },
  status: { type: String, enum: ["new", "reviewing", "shortlisted", "rejected", "hired"], default: "new" }
}, { timestamps: true }));
