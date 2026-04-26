const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  role: { type: String, enum: ["admin", "hr_manager", "customer_care_manager", "customer_care_agent", "it_support_agent", "user"], required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Invite", inviteSchema);