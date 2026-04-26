import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ identifier: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(f.identifier, f.password);
      toast.success("Welcome back!");
      nav("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="hero-panel panel-grid grid lg:grid-cols-[0.9fr_1.1fr] overflow-hidden">
        <div className="hidden lg:flex flex-col justify-center p-10 border-r border-primary/10">
          <div className="w-24 h-24 rounded-[28px] bg-primary/12 border border-primary/30 grid place-items-center">
            <Lock className="text-primary" size={34} />
          </div>
          <h2 className="text-4xl font-extrabold mt-8">Login</h2>
          <p className="text-muted mt-4 max-w-sm">Welcome back. Please log in to your account to access your dashboard, services and support tools.</p>
        </div>

        <div className="p-6 sm:p-8 lg:p-10 max-w-xl w-full">
          <p className="eyebrow mb-4">Secure Access</p>
          <h1 className="text-3xl font-extrabold">Sign in to your account</h1>
          <p className="text-muted mt-3">Use your email or username and password to continue.</p>
          <form onSubmit={submit} className="space-y-4 mt-8">
            <input className="input" placeholder="Email or Username" value={f.identifier} onChange={(e) => setF({ ...f, identifier: e.target.value })} required/>
            <input className="input" type="password" placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required/>
            <button className="btn-primary w-full">Login</button>
          </form>
          <p className="text-sm text-muted mt-5">Don&apos;t have an account? <Link to="/register" className="text-accent font-semibold">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
