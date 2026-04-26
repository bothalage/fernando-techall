import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (f.password !== f.confirm) return toast.error("Passwords do not match");
    try {
      await register(f.name, f.email, f.password);
      toast.success("Account created!");
      nav("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="hero-panel panel-grid grid lg:grid-cols-[0.9fr_1.1fr] overflow-hidden">
        <div className="hidden lg:flex flex-col justify-center p-10 border-r border-primary/10">
          <div className="w-24 h-24 rounded-[28px] bg-accent/12 border border-accent/30 grid place-items-center">
            <UserPlus className="text-accent" size={34} />
          </div>
          <h2 className="text-4xl font-extrabold mt-8">Register</h2>
          <p className="text-muted mt-4 max-w-sm">Create your account to manage services, support requests and billing in one place.</p>
        </div>

        <div className="p-6 sm:p-8 lg:p-10 max-w-xl w-full">
          <p className="eyebrow mb-4">Create Account</p>
          <h1 className="text-3xl font-extrabold">Start with Fernando TechAll</h1>
          <p className="text-muted mt-3">Create your profile and access the client dashboard.</p>
          <form onSubmit={submit} className="space-y-4 mt-8">
            <input className="input" placeholder="Full Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required/>
            <input className="input" type="email" placeholder="Email Address" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required/>
            <input className="input" type="password" placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required minLength={6}/>
            <input className="input" type="password" placeholder="Confirm Password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} required/>
            <button className="btn-primary w-full">Register</button>
          </form>
          <p className="text-sm text-muted mt-5">Already have an account? <Link to="/login" className="text-accent font-semibold">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
