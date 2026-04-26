const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = ["admin", "hr_manager", "customer_care_manager", "customer_care_agent", "it_support_agent", "user"];
const PLANS = ["free", "starter", "pro", "enterprise"];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ROLES, default: "user" },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  plan: { type: String, enum: PLANS, default: "free" },
  planRenewsAt: { type: Date, default: null },
  payhereOrderId: { type: String, default: null },
  payherePaymentId: { type: String, default: null },
  avatar: { type: String, default: "" },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  inviteToken: { type: String, default: null },
  inviteExpires: { type: Date, default: null }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.compare = function (pw) { return bcrypt.compare(pw, this.password); };

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;
module.exports.PLANS = PLANS;
