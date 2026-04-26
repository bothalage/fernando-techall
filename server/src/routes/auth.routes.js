const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");
const Company = require("../models/Company");
const Invite = require("../models/Invite");
const { protect } = require("../middleware/auth");
const { sendTemplate } = require("../emails/mailer");

const sign = (u) => jwt.sign({ id: u._id, role: u.role, company: u.company }, process.env.JWT_SECRET, { expiresIn: "7d" });
const serializeUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  company: user.company,
  plan: user.plan,
  planRenewsAt: user.planRenewsAt,
  payhereOrderId: user.payhereOrderId,
  payherePaymentId: user.payherePaymentId,
  avatar: user.avatar
});

router.post("/register", async (req, res) => {
  try {
    const data = z.object({
      name: z.string().min(2).max(80),
      email: z.string().email(),
      password: z.string().min(6).max(100),
      companyName: z.string().min(2).max(100).optional()
    }).parse(req.body);
    const exists = await User.findOne({ email: data.email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    let company;
    if (data.companyName) {
      company = await Company.create({ name: data.companyName, domain: data.email.split('@')[1], owner: null });
    } else {
      // Create personal company
      company = await Company.create({ name: `${data.name}'s Company`, domain: data.email.split('@')[1], owner: null });
    }

    const user = await User.create({ ...data, role: "admin", company: company._id });
    company.owner = user._id;
    await company.save();

    res.json({ token: sign(user), user: serializeUser(user) });
  } catch (e) { res.status(400).json({ message: e.errors?.[0]?.message || e.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = z.object({
      identifier: z.string().trim().min(1),
      password: z.string().min(1)
    }).parse(req.body);

    const normalized = identifier.toLowerCase();
    const user = await User.findOne({
      $or: [
        { email: normalized },
        { name: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }
      ]
    });
    if (!user || !(await user.compare(password))) return res.status(400).json({ message: "Invalid credentials" });
    res.json({ token: sign(user), user: serializeUser(user) });
  } catch (e) { res.status(400).json({ message: e.errors?.[0]?.message || e.message }); }
});

router.post("/invite", protect, async (req, res) => {
  try {
    const data = z.object({
      email: z.string().email(),
      role: z.enum(["admin", "hr_manager", "customer_care_manager", "customer_care_agent", "it_support_agent", "user"])
    }).parse(req.body);

    const token = require('crypto').randomBytes(32).toString('hex');
    const company = await Company.findById(req.user.company);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const invite = await Invite.create({
      email: data.email,
      role: data.role,
      company: req.user.company,
      invitedBy: req.user._id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Send invite email
    const acceptLink = `${process.env.CLIENT_ORIGIN}/accept-invite?token=${token}`;
    await sendTemplate("invite-team", data.email, {
      email: data.email,
      company: company.name,
      invitedByName: req.user.name,
      role: data.role.replace(/_/g, " "),
      acceptLink
    }).catch(console.error);

    res.json({ message: "Invite sent" });
  } catch (e) { res.status(400).json({ message: e.errors?.[0]?.message || e.message }); }
});

router.post("/accept-invite", async (req, res) => {
  try {
    const data = z.object({
      token: z.string(),
      name: z.string().min(2).max(80),
      password: z.string().min(6).max(100)
    }).parse(req.body);

    const invite = await Invite.findOne({ token: data.token, used: false });
    if (!invite || invite.expiresAt < new Date()) return res.status(400).json({ message: "Invalid or expired invite" });

    const exists = await User.findOne({ email: invite.email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name: data.name,
      email: invite.email,
      password: data.password,
      role: invite.role,
      company: invite.company,
      invitedBy: invite.invitedBy
    });

    invite.used = true;
    await invite.save();

    res.json({ token: sign(user), user: serializeUser(user) });
  } catch (e) { res.status(400).json({ message: e.errors?.[0]?.message || e.message }); }
});

router.get("/me", protect, async (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

module.exports = router;
