const router = require("express").Router();
const { protect, allow } = require("../middleware/auth");
const { sendMail, sendTemplate } = require("../emails/mailer");

router.post("/send", protect, allow("admin"), async (req, res) => {
  try {
    const { to, subject, html, template, data = {} } = req.body;
    const result = template
      ? await sendTemplate(template, to, data)
      : await sendMail({ to, subject, html });
    res.json(result);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
