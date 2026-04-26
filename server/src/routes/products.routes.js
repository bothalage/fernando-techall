const router = require("express").Router();
const Product = require("../models/Product");
const { protect, allow } = require("../middleware/auth");
router.get("/", async (_req, res) => res.json(await Product.find().sort("-createdAt")));
router.post("/", protect, allow("admin"), async (req, res) => res.json(await Product.create(req.body)));
router.put("/:id", protect, allow("admin"), async (req, res) => res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete("/:id", protect, allow("admin"), async (req, res) => { await Product.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = router;
