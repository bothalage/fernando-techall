const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const router = express.Router();
const User = require("../models/User");
const Company = require("../models/Company");
const PLANS = require("../config/plans");
const { protect, allow } = require("../middleware/auth");
const { sendTemplate } = require("../emails/mailer");

const getPayPalConfig = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  const isSandbox = process.env.PAYPAL_SANDBOX !== "false";
  return {
    clientId,
    clientSecret,
    apiBase: isSandbox
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com",
    webBase: isSandbox
      ? "https://www.sandbox.paypal.com"
      : "https://www.paypal.com"
  };
};

// Get PayPal access token
const getAccessToken = async (config) => {
  const response = await axios({
    url: `${config.apiBase}/v1/oauth2/token`,
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    auth: { username: config.clientId, password: config.clientSecret },
    data: "grant_type=client_credentials"
  });
  return response.data.access_token;
};

// Public plans catalog
router.get("/plans", (_req, res) => res.json(Object.values(PLANS)));

// Create PayPal Order (User subscription)
router.post("/checkout", protect, async (req, res) => {
  try {
    const pp = getPayPalConfig();
    if (!pp) return res.status(500).json({ message: "PayPal not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET" });

    const { planId } = req.body;
    const plan = PLANS[planId];
    if (!plan || plan.id === "free") return res.status(400).json({ message: "Invalid plan" });

    const accessToken = await getAccessToken(pp);
    const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

    const orderResponse = await axios({
      url: `${pp.apiBase}/v2/checkout/orders`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: plan.price.toFixed(2)
          },
          description: `${plan.name} Plan - Fernando TechAll`,
          custom_id: JSON.stringify({ type: "user", userId: String(req.user._id), planId })
        }],
        application_context: {
          brand_name: "Fernando TechAll",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${origin}/billing/success`,
          cancel_url: `${origin}/pricing?canceled=1`
        }
      }
    });

    const order = orderResponse.data;
    res.json({
      orderId: order.id,
      approvalUrl: order.links.find(l => l.rel === "approve")?.href
    });
  } catch (e) {
    console.error(e.response?.data || e);
    res.status(500).json({ message: e.message });
  }
});

// Create PayPal Order (Company subscription)
router.post("/company/checkout", protect, allow("admin"), async (req, res) => {
  try {
    const pp = getPayPalConfig();
    if (!pp) return res.status(500).json({ message: "PayPal not configured" });

    const { planId } = req.body;
    const plan = PLANS[planId];
    if (!plan || plan.id === "free") return res.status(400).json({ message: "Invalid plan" });

    const company = await Company.findById(req.user.company);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const accessToken = await getAccessToken(pp);
    const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

    const orderResponse = await axios({
      url: `${pp.apiBase}/v2/checkout/orders`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: plan.price.toFixed(2)
          },
          description: `${plan.name} Plan - ${company.name}`,
          custom_id: JSON.stringify({ type: "company", companyId: String(company._id), planId })
        }],
        application_context: {
          brand_name: "Fernando TechAll",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${origin}/dashboard?subscription_success=1`,
          cancel_url: `${origin}/dashboard?subscription_canceled=1`
        }
      }
    });

    const order = orderResponse.data;
    res.json({
      orderId: order.id,
      approvalUrl: order.links.find(l => l.rel === "approve")?.href
    });
  } catch (e) {
    console.error(e.response?.data || e);
    res.status(500).json({ message: e.message });
  }
});

// Capture payment after user approves
router.post("/capture", protect, async (req, res) => {
  try {
    const pp = getPayPalConfig();
    if (!pp) return res.status(500).json({ message: "PayPal not configured" });

    const { orderId } = req.body;
    const accessToken = await getAccessToken(pp);

    const captureResponse = await axios({
      url: `${pp.apiBase}/v2/checkout/orders/${orderId}/capture`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

    const capture = captureResponse.data;
    if (capture.status !== "COMPLETED") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const purchaseUnit = capture.purchase_units[0];
    const payment = purchaseUnit.payments.captures[0];
    const customData = JSON.parse(purchaseUnit.custom_id || "{}");
    const { type, userId, companyId, planId } = customData;
    const plan = PLANS[planId];

    if (!plan) return res.status(400).json({ message: "Unknown plan" });

    // 30-day subscription
    const planRenewsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (type === "company" && companyId) {
      const company = await Company.findByIdAndUpdate(companyId, {
        plan: planId,
        planRenewsAt,
        payhereOrderId: orderId,
        payherePaymentId: payment.id
      }, { new: true });
      if (company) {
        const owner = await User.findById(company.owner);
        if (owner) {
          await sendTemplate("checkout-success", owner.email, {
            user: owner, plan, appUrl: process.env.CLIENT_ORIGIN
          }).catch(console.error);
        }
        return res.json({ ok: true, plan: planId });
      }
    } else if (type === "user" && userId) {
      const user = await User.findByIdAndUpdate(userId, {
        plan: planId,
        planRenewsAt,
        payhereOrderId: orderId,
        payherePaymentId: payment.id
      }, { new: true });
      if (user) {
        await sendTemplate("checkout-success", user.email, {
          user, plan, appUrl: process.env.CLIENT_ORIGIN
        }).catch(console.error);
        return res.json({ ok: true, plan: planId });
      }
    }

    res.status(400).json({ message: "Invalid payment data" });
  } catch (e) {
    console.error(e.response?.data || e);
    res.status(500).json({ message: e.message });
  }
});

// Company subscription status
router.get("/company/status", protect, allow("admin"), async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({
      plan: company.plan,
      planRenewsAt: company.planRenewsAt
    });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Verify payment status
router.get("/verify/:orderId", protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const pp = getPayPalConfig();
    if (!pp) return res.status(500).json({ message: "PayPal not configured" });

    const accessToken = await getAccessToken(pp);
    const orderResponse = await axios({
      url: `${pp.apiBase}/v2/checkout/orders/${orderId}`,
      method: "get",
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const order = orderResponse.data;
    const isPaid = order.status === "COMPLETED" || order.status === "APPROVED";

    // Also check local DB
    const user = await User.findOne({ payhereOrderId: orderId });
    const company = await Company.findOne({ payhereOrderId: orderId });
    const entity = user || company;

    if (isPaid && entity) {
      return res.json({ ok: true, plan: entity.plan, planRenewsAt: entity.planRenewsAt });
    }

    res.json({ ok: false });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;

