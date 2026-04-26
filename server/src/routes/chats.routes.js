const router = require("express").Router();
const Chat = require("../models/Chat");
const { protect, allow } = require("../middleware/auth");

// User starts/gets their open chat
router.post("/start", protect, async (req, res) => {
  let chat = await Chat.findOne({ customer: req.user._id, company: req.user.company, status: { $ne: "closed" } });
  if (!chat) chat = await Chat.create({ customer: req.user._id, company: req.user.company });
  res.json(chat);
});

router.get("/mine", protect, async (req, res) => {
  const chat = await Chat.findOne({ customer: req.user._id, company: req.user.company, status: { $ne: "closed" } })
    .populate("agent", "name email role");
  res.json(chat);
});

// Admin/manager: list all chats; agent: list assigned + queued
router.get("/", protect, allow("admin", "customer_care_manager", "customer_care_agent"), async (req, res) => {
  let q = { company: req.user.company };
  if (req.user.role === "customer_care_agent") q = { company: req.user.company, $or: [{ agent: req.user._id }, { status: "queued" }] };
  const list = await Chat.find(q).populate("customer", "name email").populate("agent", "name email").sort("-updatedAt");
  res.json(list);
});

// Assign agent
router.patch("/:id/assign", protect, allow("admin", "customer_care_manager", "customer_care_agent"), async (req, res) => {
  const agent = req.body.agent || req.user._id;
  const chat = await Chat.findOneAndUpdate(
    { _id: req.params.id, company: req.user.company },
    { agent, status: "active" },
    { new: true }
  );
  if (!chat) return res.status(404).json({ message: "Chat not found" });
  req.app.get("io").to(`chat:${chat._id}`).emit("chat:assigned", chat);
  res.json(chat);
});

router.patch("/:id/close", protect, async (req, res) => {
  const chat = await Chat.findOneAndUpdate(
    { _id: req.params.id, company: req.user.company },
    { status: "closed" },
    { new: true }
  );
  if (!chat) return res.status(404).json({ message: "Chat not found" });
  res.json(chat);
});

module.exports = router;
