import { useEffect, useState } from "react";
import api from "../api/client";
import toast from "react-hot-toast";
import { Users, Plus, Mail, X, Check } from "lucide-react";

export default function TeamManagement() {
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data } = await api.get("/users");
      setMembers(data);
    } catch (e) {
      console.error("Failed to load members:", e);
    }
  };

  const sendInvite = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/invite", { email: inviteEmail, role: inviteRole });
      toast.success("Invite sent!");
      setInviteEmail("");
      setInviteRole("user");
      setShowInviteForm(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (userId) => {
    if (confirm("Are you sure you want to remove this user?")) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success("User removed");
        loadMembers();
      } catch (e) {
        toast.error(e.response?.data?.message || "Failed to remove user");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users size={20} />
          Team Members
        </h2>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          Invite Member
        </button>
      </div>

      {showInviteForm && (
        <form onSubmit={sendInvite} className="glass rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-surface/60 rounded-lg border border-primary/10 focus:border-primary/50 focus:outline-none text-text"
                placeholder="teammate@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-4 py-2 bg-surface/60 rounded-lg border border-primary/10 focus:border-primary/50 focus:outline-none text-text"
              >
                <option value="user">User</option>
                <option value="it_support_agent">IT Support Agent</option>
                <option value="customer_care_agent">Customer Care Agent</option>
                <option value="customer_care_manager">Care Manager</option>
                <option value="hr_manager">HR Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Invite"}
            </button>
            <button
              type="button"
              onClick={() => setShowInviteForm(false)}
              className="px-4 py-2 bg-surface/60 text-text rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member._id} className="glass rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-xs text-muted">{member.email}</p>
              </div>
              <button
                onClick={() => removeUser(member._id)}
                className="p-1 text-muted hover:text-accent transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                {member.role.replace(/_/g, " ")}
              </span>
              {member.invitedBy && (
                <Check size={16} className="text-accent" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
