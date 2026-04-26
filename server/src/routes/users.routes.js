const router = require("express").Router();
const User = require("../models/User");
const { protect, allow } = require("../middleware/auth");

router.get("/", protect, allow("admin", "customer_care_manager", "hr_manager"), async (req, res) => {
  const { role } = req.query;
  const q = role ? { role } : {};
  res.json(await User.find(q).select("-password"));
});

router.patch("/:id/role", protect, allow("admin"), async (req, res) => {
  const u = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("-password");
  res.json(u);
});

module.exports = router;
