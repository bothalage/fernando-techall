import { useEffect, useState } from "react";
import api from "../../api/client";
import toast from "react-hot-toast";
import { BriefcaseBusiness, UserRoundSearch } from "lucide-react";

export default function HRDashboard() {
  const [careers, setCareers] = useState([]);
  const [applications, setApplications] = useState([]);

  const load = async () => {
    const [careerList, applicationList] = await Promise.all([
      api.get("/careers/all"),
      api.get("/careers/applications/list")
    ]);
    setCareers(careerList.data);
    setApplications(applicationList.data);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await api.patch(`/careers/applications/${id}/status`, { status });
    toast.success("Application updated");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl grid place-items-center bg-primary/12 border border-primary/20">
              <BriefcaseBusiness className="text-primary" size={20} />
            </div>
            <div>
              <div className="text-xs text-muted">Open Careers</div>
              <div className="text-3xl font-extrabold">{careers.filter((career) => career.isActive).length}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl grid place-items-center bg-primary/12 border border-primary/20">
              <UserRoundSearch className="text-primary" size={20} />
            </div>
            <div>
              <div className="text-xs text-muted">Applications</div>
              <div className="text-3xl font-extrabold">{applications.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Applications Pipeline</h2>
        <div className="space-y-3">
          {applications.map((application) => (
            <div key={application._id} className="rounded-2xl border border-primary/10 bg-surface/40 px-4 py-4 flex flex-wrap justify-between gap-4">
              <div>
                <div className="font-semibold">{application.fullName}</div>
                <div className="text-xs text-muted mt-1">{application.email} · {application.phone || "No phone provided"}</div>
                <div className="text-sm text-muted mt-2">{application.career?.title}</div>
              </div>
              <select className="input max-w-[200px]" value={application.status} onChange={(e) => setStatus(application._id, e.target.value)}>
                <option value="new">new</option>
                <option value="reviewing">reviewing</option>
                <option value="shortlisted">shortlisted</option>
                <option value="rejected">rejected</option>
                <option value="hired">hired</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
