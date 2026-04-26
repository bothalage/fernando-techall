const router = require("express").Router();
const Testimonial = require("../models/Testimonial");
const { protect, allow } = require("../middleware/auth");
router.get("/", async (_req, res) => res.json(await Testimonial.find().sort("-createdAt")));
router.post("/", protect, allow("admin"), async (req, res) => res.json(await Testimonial.create(req.body)));
router.delete("/:id", protect, allow("admin"), async (req, res) => { await Testimonial.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = router;
