import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/client";
import toast from "react-hot-toast";
import { Hexagon, AlertCircle } from "lucide-react";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid invite link");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/accept-invite", { token, name, password });
      localStorage.setItem("token", data.token);
      toast.success("Account created! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to accept invite");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <AlertCircle className="text-accent" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Invalid Invite</h1>
          <p className="text-muted text-center">The invite link is missing or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/10 to-transparent">
      <div className="glass rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-xl grid place-items-center bg-primary/15 border border-primary/35">
            <Hexagon className="text-primary" size={24} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Join Team</h1>
        <p className="text-muted text-center text-sm mb-6">Complete your account setup to join</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full px-4 py-2 bg-surface/60 rounded-lg border border-primary/10 focus:border-primary/50 focus:outline-none text-text placeholder-muted"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 bg-surface/60 rounded-lg border border-primary/10 focus:border-primary/50 focus:outline-none text-text placeholder-muted"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 bg-surface/60 rounded-lg border border-primary/10 focus:border-primary/50 focus:outline-none text-text placeholder-muted"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? "Setting up..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
