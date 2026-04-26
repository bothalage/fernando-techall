import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { Hexagon, Palette } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/experience", label: "Experience" },
  { to: "/products", label: "Products" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" }
];

export default function Navbar() {
  const { user } = useAuth();
  const { current, cycle } = useTheme();

  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 pt-4">
      <div className="glass max-w-7xl mx-auto rounded-2xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 font-extrabold tracking-tight text-lg">
          <span className="w-9 h-9 rounded-xl grid place-items-center bg-primary/15 border border-primary/35">
            <Hexagon className="text-primary" size={20} />
          </span>
          <span>FERNANDO <span className="text-accent">TECHALL</span></span>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={cycle} className="btn-ghost p-2" title={`Theme: ${current.name}`}>
            <Palette size={18} />
          </button>
          {user
            ? <Link to="/dashboard" className="btn-primary">Dashboard</Link>
            : <Link to="/login" className="btn-ghost">Login</Link>}
        </div>
      </div>
    </header>
  );
}
