import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  LayoutDashboard,
  MessageSquare,
  Ticket,
  Briefcase,
  Package,
  Home,
  CreditCard,
  Shield,
  BriefcaseBusiness,
  Users,
  LogOut,
  Hexagon
} from "lucide-react";

function getLinks(role) {
  if (role === "admin") {
    return [
      { label: "Dashboard", icon: LayoutDashboard, active: true },
      { label: "Messages", icon: MessageSquare },
      { label: "Tickets", icon: Ticket },
      { label: "Services", icon: Briefcase },
      { label: "Products", icon: Package },
      { label: "Careers", icon: BriefcaseBusiness }
    ];
  }

  if (role === "hr_manager") {
    return [
      { label: "Dashboard", icon: LayoutDashboard, active: true },
      { label: "Careers", icon: BriefcaseBusiness },
      { label: "Applications", icon: Users },
      { label: "Back Home", icon: Home, to: "/" }
    ];
  }

  if (role === "it_support_agent") {
    return [
      { label: "Dashboard", icon: LayoutDashboard, active: true },
      { label: "Assigned Tickets", icon: Ticket },
      { label: "Knowledge Base", icon: Shield },
      { label: "Back Home", icon: Home, to: "/" }
    ];
  }

  if (role === "customer_care_agent" || role === "customer_care_manager") {
    return [
      { label: "Dashboard", icon: LayoutDashboard, active: true },
      { label: "Live Chats", icon: MessageSquare },
      { label: "Tickets", icon: Ticket },
      { label: "Back Home", icon: Home, to: "/" }
    ];
  }

  return [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "My Services", icon: Briefcase },
    { label: "My Products", icon: Package },
    { label: "Support Tickets", icon: Ticket },
    { label: "Billing", icon: CreditCard, to: "/pricing" }
  ];
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const links = getLinks(user?.role);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="grid lg:grid-cols-[248px_minmax(0,1fr)] gap-4">
        <aside className="glass rounded-[24px] px-4 py-5 h-fit lg:sticky lg:top-4">
          <Link to="/" className="flex items-center gap-3 font-extrabold tracking-tight text-base mb-7">
            <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary/15 border border-primary/35">
              <Hexagon className="text-primary" size={20} />
            </span>
            <span>FERNANDO <span className="text-accent">TECHALL</span></span>
          </Link>

          <div className="space-y-2">
            {links.map(({ label, icon: Icon, to, active }) => (
              to ? (
                <Link key={label} to={to} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${location.pathname === to ? "bg-primary text-white" : "text-muted hover:bg-primary/10 hover:text-text"}`}>
                  <Icon size={16} />
                  {label}
                </Link>
              ) : (
                <div key={label} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${active ? "bg-gradient-to-r from-primary to-accent text-white" : "text-muted hover:bg-primary/10 hover:text-text"}`}>
                  <Icon size={16} />
                  {label}
                </div>
              )
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-primary/10">
            <button
              className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-muted hover:bg-primary/10 hover:text-text"
              onClick={() => { logout(); nav("/"); }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <div className="space-y-4">
          <header className="glass rounded-[24px] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-muted text-sm">Signed in as</p>
              <h1 className="text-2xl font-extrabold">{user?.role?.replaceAll("_", " ") || "Dashboard"}</h1>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/" className="btn-ghost"><Home size={16} className="mr-2" />Home</Link>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface/70 border border-primary/10">
                <img src={`https://i.pravatar.cc/72?u=${user?.email}`} className="w-11 h-11 rounded-full" alt={`${user?.name} avatar`} />
                <div>
                  <div className="font-semibold leading-tight">{user?.name}</div>
                  <div className="text-xs text-muted">{user?.email}</div>
                </div>
              </div>
            </div>
          </header>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
