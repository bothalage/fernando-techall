const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  status: { type: String, enum: ["queued", "active", "closed"], default: "queued" },
  messages: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    at: { type: Date, default: Date.now }
  }]
}, { timestamps: true });
module.exports = mongoose.model("Chat", chatSchema);
