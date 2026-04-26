const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");

const TEMPLATE_DIR = path.join(__dirname, "templates");
const cache = new Map();

function load(name) {
  if (cache.has(name)) return cache.get(name);
  const file = path.join(TEMPLATE_DIR, `${name}.hbs`);
  const src = fs.readFileSync(file, "utf8");
  // Pull subject from first "{{!-- subject: ... --}}" line, optional
  const subjMatch = src.match(/\{\{!--\s*subject:\s*(.+?)\s*--\}\}/);
  const subjectTpl = Handlebars.compile(subjMatch ? subjMatch[1] : `Fernando TechAll: ${name}`);
  const bodyTpl = Handlebars.compile(src.replace(/\{\{!--[\s\S]*?--\}\}/g, ""));
  const tpl = { subjectTpl, bodyTpl };
  cache.set(name, tpl);
  return tpl;
}

function getTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

async function sendMail({ to, subject, html }) {
  const transporter = getTransport();
  if (!transporter) {
    console.log(`[mail simulated] -> ${to} | ${subject}`);
    return { ok: true, simulated: true };
  }
  await transporter.sendMail({
    from: process.env.MAIL_FROM || "Fernando TechAll <no-reply@fernandotechall.com>",
    to,
    subject,
    html
  });
  return { ok: true };
}

async function sendTemplate(templateName, to, data = {}) {
  const { subjectTpl, bodyTpl } = load(templateName);
  const ctx = { brand: "Fernando TechAll", year: new Date().getFullYear(), ...data };
  const subject = subjectTpl(ctx).trim();
  const html = bodyTpl(ctx);
  return sendMail({ to, subject, html });
}

module.exports = { sendMail, sendTemplate, load };
