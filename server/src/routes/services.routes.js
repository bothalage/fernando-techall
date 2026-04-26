const router = require("express").Router();
const Service = require("../models/Service");
const { protect, allow } = require("../middleware/auth");
router.get("/", async (_req, res) => res.json(await Service.find().sort("-createdAt")));
router.post("/", protect, allow("admin"), async (req, res) => res.json(await Service.create(req.body)));
router.put("/:id", protect, allow("admin"), async (req, res) => res.json(await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete("/:id", protect, allow("admin"), async (req, res) => { await Service.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = router;
