import { useEffect, useState } from "react";
import api from "../../api/client";
import toast from "react-hot-toast";
import { Ticket, AlertTriangle } from "lucide-react";

export default function ITSupportDashboard() {
  const [tickets, setTickets] = useState([]);

  const load = () => api.get("/tickets").then(({ data }) => setTickets(data));

  useEffect(() => { load(); }, []);

  const selfAssign = async (id) => {
    await api.patch(`/tickets/${id}/assign`, {});
    toast.success("Self-assigned");
    load();
  };

  const setStatus = async (id, status) => {
    await api.patch(`/tickets/${id}/status`, { status });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-2xl font-extrabold">IT Support Dashboard</h1>
        <p className="text-muted mt-2">Track unassigned issues, claim tickets, and progress them through resolution.</p>
      </div>

      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t._id} className="card flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2 font-semibold">
                <Ticket size={16} className="text-primary" />
                {t.subject}
              </div>
              <div className="text-xs text-muted mt-2">By {t.createdBy?.name} · Priority {t.priority} · Assigned {t.assignedTo?.name || "Nobody yet"}</div>
              <p className="text-sm text-muted mt-2">{t.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {!t.assignedTo && <button onClick={() => selfAssign(t._id)} className="btn-primary">Self Assign</button>}
              <select className="input min-w-[180px]" value={t.status} onChange={(e) => setStatus(t._id, e.target.value)}>
                <option value="open">open</option>
                <option value="in_progress">in_progress</option>
                <option value="resolved">resolved</option>
                <option value="closed">closed</option>
              </select>
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <div className="card text-center">
            <AlertTriangle className="mx-auto text-primary" />
            <p className="text-muted mt-3">No tickets available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
