const router = require("express").Router();
const { z } = require("zod");
const Career = require("../models/Career");
const CareerApplication = require("../models/CareerApplication");
const { protect, allow } = require("../middleware/auth");

const adminRoles = ["admin", "hr_manager"];

router.get("/", async (_req, res) => {
  const careers = await Career.find({ isActive: true }).sort("-createdAt");
  res.json(careers);
});

router.get("/all", protect, allow(...adminRoles), async (_req, res) => {
  res.json(await Career.find().sort("-createdAt"));
});

router.post("/", protect, allow(...adminRoles), async (req, res) => {
  const data = z.object({
    title: z.string().min(2),
    department: z.string().min(2),
    location: z.string().min(2),
    type: z.enum(["full_time", "part_time", "contract", "internship"]),
    experience: z.string().min(2),
    salary: z.string().min(1),
    summary: z.string().min(10),
    description: z.string().min(10),
    responsibilities: z.array(z.string()).default([]),
    requirements: z.array(z.string()).default([]),
    isActive: z.boolean().default(true)
  }).parse(req.body);

  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const career = await Career.create({ ...data, slug: `${slug}-${Date.now().toString().slice(-5)}` });
  res.json(career);
});

router.put("/:id", protect, allow(...adminRoles), async (req, res) => {
  const updated = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", protect, allow(...adminRoles), async (req, res) => {
  await Career.findByIdAndDelete(req.params.id);
  await CareerApplication.deleteMany({ career: req.params.id });
  res.json({ ok: true });
});

router.post("/:id/apply", async (req, res) => {
  const data = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional().default(""),
    linkedinUrl: z.string().optional().default(""),
    portfolioUrl: z.string().optional().default(""),
    resumeUrl: z.string().optional().default(""),
    coverLetter: z.string().optional().default("")
  }).parse(req.body);

  const career = await Career.findById(req.params.id);
  if (!career || !career.isActive) return res.status(404).json({ message: "Career not found" });
  const application = await CareerApplication.create({ career: career._id, ...data });
  res.json({ ok: true, application });
});

router.get("/applications/list", protect, allow(...adminRoles), async (_req, res) => {
  const list = await CareerApplication.find().populate("career", "title department type location").sort("-createdAt");
  res.json(list);
});

router.patch("/applications/:id/status", protect, allow(...adminRoles), async (req, res) => {
  const updated = await CareerApplication.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    .populate("career", "title department type location");
  res.json(updated);
});

module.exports = router;
