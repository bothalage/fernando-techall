import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import Section from "../components/Section.jsx";
import Hex from "../components/Hex.jsx";
import { Check, Crown } from "lucide-react";
import toast from "react-hot-toast";

export default function Pricing() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => { api.get("/payments/plans").then(({ data }) => setPlans(data)); }, []);

  const subscribe = async (planId) => {
    if (!user) { toast.error("Please login first"); return nav("/login"); }
    if (planId === "free") return nav("/dashboard");
    setLoading(planId);
    try {
      const { data } = await api.post("/payments/checkout", { planId });
      // PayPal redirect
      if (data.approvalUrl) window.location.href = data.approvalUrl;
    } catch (e) {
      toast.error(e.response?.data?.message || "Checkout failed");
    } finally { setLoading(null); }
  };

  return (
    <Section eyebrow="Pricing" title="Choose your plan">
      <p className="text-muted -mt-4 mb-8">Simple, transparent pricing. Upgrade or cancel anytime.</p>
      <div className="grid md:grid-cols-4 gap-5">
        {plans.map((p) => {
          const current = user?.plan === p.id;
          const highlight = p.id === "pro";
          return (
            <div key={p.id} className={`card relative ${highlight ? "ring-2 ring-primary shadow-glow" : ""}`}>
              {highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full">Most popular</div>}
              <div className="flex items-center gap-3 mb-3">
                <Hex size={48}>{p.id === "enterprise" ? <Crown size={18}/> : <span className="text-xs font-bold">{p.name[0]}</span>}</Hex>
                <div>
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-xs text-muted">{p.interval ? `Billed ${p.interval}ly` : "Forever free"}</p>
                </div>
              </div>
              <div className="text-3xl font-extrabold">${p.price}<span className="text-sm text-muted font-normal">{p.interval ? `/${p.interval}` : ""}</span></div>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="text-primary mt-0.5"/> {f}</li>)}
              </ul>
              <button
                disabled={current || loading === p.id}
                onClick={() => subscribe(p.id)}
                className={`mt-5 w-full ${current ? "nav-link border border-primary/40 text-center" : "btn-primary"}`}>
                {current ? "Current plan" : loading === p.id ? "Redirecting..." : (p.price === 0 ? "Get started" : "Subscribe")}
              </button>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
