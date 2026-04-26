import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Featured from "./pages/Featured.jsx";
import Experience from "./pages/Experience.jsx";
import Products from "./pages/Products.jsx";
import Careers from "./pages/Careers.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Register from "./pages/Register.jsx";
import AcceptInvite from "./pages/AcceptInvite.jsx";
import Pricing from "./pages/Pricing.jsx";
import BillingSuccess from "./pages/BillingSuccess.jsx";
import UserDashboard from "./pages/dashboards/UserDashboard.jsx";
import AdminDashboard from "./pages/dashboards/AdminDashboard.jsx";
import HRDashboard from "./pages/dashboards/HRDashboard.jsx";
import ITSupportDashboard from "./pages/dashboards/ITSupportDashboard.jsx";
import CareDashboard from "./pages/dashboards/CareDashboard.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function Private({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case "admin": return <AdminDashboard />;
    case "hr_manager": return <HRDashboard />;
    case "it_support_agent": return <ITSupportDashboard />;
    case "customer_care_agent":
    case "customer_care_manager": return <CareDashboard />;
    default: return <UserDashboard />;
  }
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/featured" element={<Featured />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/products" element={<Products />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/billing/success" element={<BillingSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />
      </Route>
      <Route element={<Private><DashboardLayout /></Private>}>
        <Route path="/dashboard" element={<DashboardRouter />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
