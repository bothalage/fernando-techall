import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Ticket as TIcon,
  Package,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Crown,
  CreditCard,
  Lock,
  Briefcase
} from "lucide-react";
import toast from "react-hot-toast";

const PLAN_BADGE = {
  free: { color: "bg-muted/30 text-muted", label: "Free" },
  starter: { color: "bg-blue-500/20 text-blue-300", label: "Starter" },
  pro: { color: "bg-primary/30 text-primary", label: "Pro" },
  enterprise: { color: "bg-yellow-500/20 text-yellow-300", label: "Enterprise" }
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: "", description: "", priority: "medium" });

  const load = async () => {
    const [s, p, t] = await Promise.all([api.get("/services"), api.get("/products"), api.get("/tickets")]);
    setServices(s.data);
    setProducts(p.data);
    setTickets(t.data);
  };

  useEffect(() => { load(); }, []);

  const submitTicket = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tickets", form);
      toast.success("Ticket created - check your email");
      setForm({ subject: "", description: "", priority: "medium" });
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed");
    }
  };

  const manageBilling = () => {
    nav("/pricing");
  };

  const plan = user.plan || "free";
  const isPro = plan === "pro" || plan === "enterprise";
  const badge = PLAN_BADGE[plan];

  return (
    <div className="space-y-4">
      <div className="grid xl:grid-cols-[0.88fr_1.12fr] gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <img src={`https://i.pravatar.cc/96?u=${user.email}`} className="w-16 h-16 rounded-full" alt={`${user.name} avatar`} />
            <div>
              <div className="font-bold text-xl flex items-center gap-2">
                {user.name}
                <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
                {plan === "enterprise" && <Crown size={16} className="text-yellow-300" />}
              </div>
              <div className="text-muted text-sm mt-1">{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <MiniStat label="My Services" value={services.length} icon={Briefcase} />
            <MiniStat label="Orders" value={products.length} icon={Package} />
            <MiniStat label="Tickets" value={tickets.length} icon={TIcon} />
          </div>

          <div className="flex gap-2 mt-6">
            <Link to="/pricing" className="btn-ghost">{plan === "free" ? "Upgrade" : "Change plan"}</Link>
            {plan !== "free" && <button onClick={manageBilling} className="btn-primary"><CreditCard size={14} className="inline mr-2" />Billing</button>}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Support Tickets</h2>
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {tickets.length === 0 && <p className="text-muted text-sm">No tickets yet.</p>}
            {tickets.map((t) => (
              <div key={t._id} className="rounded-2xl border border-primary/10 bg-surface/40 px-4 py-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{t.subject}</div>
                  <p className="text-sm text-muted mt-1">{t.description}</p>
                  <div className="text-xs text-muted mt-2">Assigned: {t.assignedTo?.name || "-"}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/15 text-primary">{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-4">
        <form onSubmit={submitTicket} className="card space-y-4">
          <div className="flex items-center gap-2">
            <Headphones className="text-primary" size={18} />
            <h3 className="font-bold text-lg">Open IT Support Ticket</h3>
          </div>
          <input className="input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <textarea className="input min-h-[120px]" placeholder="Describe your issue" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical" disabled={!isPro}>{isPro ? "Critical" : "Critical (Pro+ only)"}</option>
          </select>
          {!isPro && <p className="text-xs text-muted flex items-center gap-1"><Lock size={12} /> Pro+ unlocks unlimited tickets and critical priority. <Link to="/pricing" className="text-accent">Upgrade</Link></p>}
          <button className="btn-primary w-full">Create Ticket</button>
        </form>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-bold text-lg mb-4">My Services</h3>
            <div className="space-y-3">
              {services.slice(0, 4).map((s) => (
                <div key={s._id} className="rounded-2xl border border-primary/10 bg-surface/40 px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-xs text-muted mt-1">{s.price}</div>
                  </div>
                  <span className="text-xs text-emerald-400">Active</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm text-muted">
              <p className="flex items-center gap-2"><MapPin size={14} /> 537, Thalahena, Negombo</p>
              <p className="flex items-center gap-2"><Phone size={14} /> +94 76 186 4769</p>
              <p className="flex items-center gap-2"><Mail size={14} /> info@fernandotechall.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-surface/40 px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted">{label}</div>
          <div className="text-2xl font-bold mt-2">{value}</div>
        </div>
        <div className="w-10 h-10 rounded-2xl grid place-items-center bg-primary/12 border border-primary/20">
          <Icon className="text-primary" size={16} />
        </div>
      </div>
    </div>
  );
}
