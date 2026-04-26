const router = require("express").Router();
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const { protect, allow } = require("../middleware/auth");
const { sendTemplate } = require("../emails/mailer");

const shortId = (id) => String(id).slice(-6).toUpperCase();
const PLAN_LIMITS = { free: 1, starter: 5, pro: Infinity, enterprise: Infinity };

router.post("/", protect, async (req, res) => {
  const { subject, description, priority } = req.body;
  // Plan-gated open ticket count
  const limit = PLAN_LIMITS[req.user.plan] ?? 1;
  const open = await Ticket.countDocuments({ createdBy: req.user._id, status: { $in: ["open", "in_progress"] } });
  if (open >= limit) return res.status(403).json({ message: `Your ${req.user.plan} plan allows ${limit} open ticket(s). Upgrade to open more.` });

  // Pro+ users can mark high priority
  const safePriority = ["pro", "enterprise"].includes(req.user.plan) ? priority : (priority === "critical" ? "high" : priority);
  const t = await Ticket.create({ subject, description, priority: safePriority, createdBy: req.user._id, company: req.user.company });
  sendTemplate("ticket-created", req.user.email, {
    user: req.user, ticket: { ...t.toObject(), shortId: shortId(t._id) },
    appUrl: process.env.CLIENT_ORIGIN
  }).catch(console.error);
  res.json(t);
});

router.get("/", protect, async (req, res) => {
  let q = { company: req.user.company };
  if (req.user.role === "user") q.createdBy = req.user._id;
  else if (req.user.role === "it_support_agent") q = { company: req.user.company, $or: [{ assignedTo: req.user._id }, { assignedTo: null }] };
  const list = await Ticket.find(q).populate("createdBy", "name email plan").populate("assignedTo", "name email role").sort("-createdAt");
  res.json(list);
});

router.patch("/:id/assign", protect, allow("admin", "it_support_agent"), async (req, res) => {
  const assignedTo = req.body.assignedTo || req.user._id;
  const t = await Ticket.findOneAndUpdate(
    { _id: req.params.id, company: req.user.company },
    { assignedTo, status: "in_progress" },
    { new: true }
  ).populate("createdBy", "name email").populate("assignedTo", "name email");
  if (!t) return res.status(404).json({ message: "Ticket not found" });
  if (t?.createdBy?.email) sendTemplate("ticket-assigned", t.createdBy.email, {
    user: t.createdBy, agent: t.assignedTo, ticket: { ...t.toObject(), shortId: shortId(t._id) },
    appUrl: process.env.CLIENT_ORIGIN
  }).catch(console.error);
  res.json(t);
});

router.patch("/:id/status", protect, allow("admin", "it_support_agent"), async (req, res) => {
  const t = await Ticket.findOneAndUpdate(
    { _id: req.params.id, company: req.user.company },
    { status: req.body.status },
    { new: true }
  ).populate("createdBy", "name email");
  if (!t) return res.status(404).json({ message: "Ticket not found" });
  if (t?.createdBy?.email) sendTemplate("ticket-status", t.createdBy.email, {
    user: t.createdBy, ticket: { ...t.toObject(), shortId: shortId(t._id) },
    note: req.body.note || "",
    appUrl: process.env.CLIENT_ORIGIN
  }).catch(console.error);
  res.json(t);
});

router.post("/:id/comment", protect, async (req, res) => {
  const t = await Ticket.findOne({ _id: req.params.id, company: req.user.company });
  if (!t) return res.status(404).json({ message: "Not found" });
  t.comments.push({ user: req.user._id, text: req.body.text });
  await t.save();
  res.json(t);
});
module.exports = router;
