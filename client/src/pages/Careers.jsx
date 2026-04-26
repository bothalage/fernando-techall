import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Section from "../components/Section.jsx";
import api from "../api/client";
import { BriefcaseBusiness, MapPin, Clock3 } from "lucide-react";

const emptyApplication = {
  fullName: "",
  email: "",
  phone: "",
  linkedinUrl: "",
  portfolioUrl: "",
  resumeUrl: "",
  coverLetter: ""
};

export default function Careers() {
  const [careers, setCareers] = useState([]);
  const [activeCareerId, setActiveCareerId] = useState(null);
  const [form, setForm] = useState(emptyApplication);

  useEffect(() => {
    api.get("/careers").then(({ data }) => {
      setCareers(data);
      if (data[0]) setActiveCareerId(data[0]._id);
    }).catch(() => {});
  }, []);

  const activeCareer = careers.find((career) => career._id === activeCareerId) || careers[0];

  const submit = async (e) => {
    e.preventDefault();
    if (!activeCareer) return;
    await api.post(`/careers/${activeCareer._id}/apply`, form);
    toast.success("Application sent");
    setForm(emptyApplication);
  };

  return (
    <Section eyebrow="Careers" title="Join Fernando TechAll">
      <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-5">
        <div className="space-y-4">
          {careers.map((career) => (
            <button
              key={career._id}
              onClick={() => setActiveCareerId(career._id)}
              className={`card w-full text-left ${activeCareerId === career._id ? "border-accent/50" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-lg">{career.title}</div>
                  <div className="text-xs text-muted mt-2 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1"><BriefcaseBusiness size={12} /> {career.department}</span>
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {career.location}</span>
                    <span className="inline-flex items-center gap-1"><Clock3 size={12} /> {career.type.replaceAll("_", " ")}</span>
                  </div>
                  <p className="text-sm text-muted mt-3">{career.summary}</p>
                </div>
                <span className="text-accent text-sm font-semibold">{career.salary}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="card">
          {!activeCareer ? (
            <p className="text-muted">No open positions yet.</p>
          ) : (
            <>
              <h3 className="text-2xl font-bold">{activeCareer.title}</h3>
              <p className="text-muted mt-3">{activeCareer.description}</p>

              <div className="grid md:grid-cols-2 gap-5 mt-6">
                <div>
                  <h4 className="font-semibold mb-3">Responsibilities</h4>
                  <ul className="space-y-2 text-sm text-muted">
                    {activeCareer.responsibilities?.map((item) => <li key={item}>- {item}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Requirements</h4>
                  <ul className="space-y-2 text-sm text-muted">
                    {activeCareer.requirements?.map((item) => <li key={item}>- {item}</li>)}
                  </ul>
                </div>
              </div>

              <form onSubmit={submit} className="mt-8 space-y-3">
                <h4 className="font-semibold text-lg">Apply Now</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className="input" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                  <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <input className="input" placeholder="Resume URL" value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className="input" placeholder="LinkedIn URL" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
                  <input className="input" placeholder="Portfolio URL" value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} />
                </div>
                <textarea className="input min-h-[150px]" placeholder="Cover Letter" value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} />
                <button className="btn-primary">Submit Application</button>
              </form>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
