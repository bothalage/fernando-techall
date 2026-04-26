const router = require("express").Router();
const { z } = require("zod");
const ContactMessage = require("../models/ContactMessage");
const { protect, allow } = require("../middleware/auth");
const { sendTemplate } = require("../emails/mailer");

router.post("/", async (req, res) => {
  try {
    const data = z.object({
      name: z.string().trim().min(1).max(100),
      email: z.string().email().max(255),
      subject: z.string().trim().min(1).max(150),
      message: z.string().trim().min(1).max(2000)
    }).parse(req.body);
    const msg = await ContactMessage.create(data);
    sendTemplate("contact-autoreply", data.email, { contact: data, appUrl: process.env.CLIENT_ORIGIN }).catch(console.error);
    res.json({ ok: true, id: msg._id });
  } catch (e) { res.status(400).json({ message: e.errors?.[0]?.message || e.message }); }
});

router.get("/", protect, allow("admin"), async (_req, res) => res.json(await ContactMessage.find().sort("-createdAt")));
router.patch("/:id/read", protect, allow("admin"), async (req, res) => res.json(await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true })));

// Admin reply: uses contact-reply template
router.post("/:id/reply", protect, allow("admin"), async (req, res) => {
  const msg = await ContactMessage.findById(req.params.id);
  if (!msg) return res.status(404).json({ message: "Not found" });
  await sendTemplate("contact-reply", msg.email, { contact: msg, reply: req.body.reply || "" });
  msg.read = true; await msg.save();
  res.json({ ok: true });
});

module.exports = router;
