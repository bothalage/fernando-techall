// Server-side plan catalog. Prices in USD for PayPal.
module.exports = {
  free: {
    id: "free", name: "Free", price: 0, interval: null,
    features: ["Browse services", "Submit contact form", "1 open IT ticket"]
  },
  starter: {
    id: "starter", name: "Starter", price: 9, interval: "month",
    features: ["Up to 5 open tickets", "Email support", "Access to products catalog"]
  },
  pro: {
    id: "pro", name: "Pro", price: 29, interval: "month",
    features: ["Unlimited tickets", "Priority queue", "Live chat with Customer Care", "Monthly check-ins"]
  },
  enterprise: {
    id: "enterprise", name: "Enterprise", price: 99, interval: "month",
    features: ["Dedicated IT agent", "Critical priority", "24/7 live support", "Custom integrations", "SLA"]
  }
};
