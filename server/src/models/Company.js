const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  domain: { type: String, required: true, unique: true, lowercase: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  plan: { type: String, enum: ["free", "starter", "pro", "enterprise"], default: "free" },
  planRenewsAt: { type: Date, default: null },
  payhereOrderId: { type: String, default: null },
  payherePaymentId: { type: String, default: null },
  settings: {
    theme: { type: String, default: "neon" },
    allowPublicSignups: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
