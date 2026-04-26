const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
  status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String, at: { type: Date, default: Date.now }
  }]
}, { timestamps: true });
module.exports = mongoose.model("Ticket", ticketSchema);
