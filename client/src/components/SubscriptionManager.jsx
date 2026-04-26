import { useEffect, useState } from "react";
import api from "../api/client";
import toast from "react-hot-toast";
import { CreditCard, Check, ExternalLink } from "lucide-react";

export default function SubscriptionManager() {
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [planRes, plansRes] = await Promise.all([
        api.get("/payments/company/status"),
        api.get("/payments/plans")
      ]);
      setPlan(planRes.data);
      setPlans(plansRes.data);
    } catch (e) {
      console.error("Failed to load subscription data:", e);
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      setLoading(true);
      const { data } = await api.post("/payments/company/checkout", { planId });
      // PayPal redirect
      if (data.approvalUrl) window.location.href = data.approvalUrl;
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CreditCard size={20} />
          Subscription & Billing
        </h2>
      </div>

      {/* Current Plan */}
      {plan && (
        <div className="glass rounded-2xl p-6 border-l-4 border-primary">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold capitalize">{plan.plan} Plan</h3>
              <p className="text-sm text-muted">Your current subscription</p>
            </div>
            {plan.planRenewsAt && (
              <div className="text-sm text-muted">
                Renews: {new Date(plan.planRenewsAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`glass rounded-xl p-6 flex flex-col ${
              plan?.plan === p.id ? "border-2 border-primary" : "border border-primary/10"
            }`}
          >
            <h3 className="font-bold text-lg capitalize mb-2">{p.id}</h3>
            <div className="text-2xl font-bold mb-4">
              ${p.price}
              {p.price > 0 && <span className="text-xs text-muted">/mo</span>}
            </div>

            <ul className="space-y-2 flex-1 mb-4">
              {p.features?.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <Check size={14} className="text-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {plan?.plan === p.id ? (
              <button disabled className="w-full px-4 py-2 bg-surface/60 text-text rounded-lg font-semibold">
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade(p.id)}
                disabled={loading || p.id === "free"}
                className="w-full px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {p.id === "free" ? "Downgrade" : "Upgrade"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/10">
                <th className="text-left py-2 px-3">Feature</th>
                {plans.map((p) => (
                  <th key={p.id} className="text-center py-2 px-3 capitalize">{p.id}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Team Members", free: "1", starter: "5", pro: "Unlimited", enterprise: "Unlimited" },
                { name: "Tickets/Month", free: "5", starter: "50", pro: "500", enterprise: "Unlimited" },
                { name: "Chat Support", free: "No", starter: "Yes", pro: "Yes", enterprise: "Yes" },
                { name: "Analytics", free: "No", starter: "Basic", pro: "Full", enterprise: "Full" },
                { name: "AI Assistant", free: "No", starter: "No", pro: "Yes", enterprise: "Yes" },
                { name: "Priority Support", free: "No", starter: "No", pro: "Yes", enterprise: "Yes" }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-primary/5">
                  <td className="py-2 px-3 font-medium">{row.name}</td>
                  {plans.map((p) => (
                    <td key={p.id} className="text-center py-2 px-3 text-muted">
                      {row[p.id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
