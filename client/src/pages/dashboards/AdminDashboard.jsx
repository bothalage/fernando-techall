import { useEffect, useState } from "react";
import api from "../../api/client";
import toast from "react-hot-toast";
import { Briefcase, MessageSquare, Package, Plus, Send, Ticket, Users, BarChart3, CreditCard, Database, GitBranch } from "lucide-react";
import AnalyticsDashboard from "../../components/AnalyticsDashboard";
import TeamManagement from "../../components/TeamManagement";
import SubscriptionManager from "../../components/SubscriptionManager";
import DatabaseManagement from "../../components/DatabaseManagement";
import PipelineManager from "../../components/PipelineManager";

const emptyProduct = { name: "", description: "", image: "", price: 0 };
const emptyCareer = {
  title: "",
  department: "Engineering",
  location: "Remote / Sri Lanka",
  type: "full_time",
  experience: "Mid-level",
  salary: "Negotiable",
  summary: "",
  description: "",
  responsibilities: "",
  requirements: "",
  isActive: true
};

const Tab = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${active ? "bg-gradient-to-r from-primary to-accent text-white border-transparent" : "bg-surface/60 text-muted border-primary/10"}`}>
    {children}
  </button>
);

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [contacts, setContacts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [chats, setChats] = useState([]);
  const [agents, setAgents] = useState([]);
  const [careAgents, setCareAgents] = useState([]);
  const [products, setProducts] = useState([]);
  const [careers, setCareers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [mail, setMail] = useState({ to: "", subject: "", html: "" });
  const [productForm, setProductForm] = useState(emptyProduct);
  const [careerForm, setCareerForm] = useState(emptyCareer);

  const load = async () => {
    const [c, t, ch, a, ca, p, careerList, applicationList] = await Promise.all([
      api.get("/contact"),
      api.get("/tickets"),
      api.get("/chats"),
      api.get("/users", { params: { role: "it_support_agent" } }),
      api.get("/users", { params: { role: "customer_care_agent" } }),
      api.get("/products"),
      api.get("/careers/all"),
      api.get("/careers/applications/list")
    ]);
    setContacts(c.data);
    setTickets(t.data);
    setChats(ch.data);
    setAgents(a.data);
    setCareAgents(ca.data);
    setProducts(p.data);
    setCareers(careerList.data);
    setApplications(applicationList.data);
  };

  useEffect(() => { load(); }, []);

  const assignTicket = async (id, agentId) => {
    await api.patch(`/tickets/${id}/assign`, { assignedTo: agentId });
    toast.success("Assigned");
    load();
  };

  const assignChat = async (id, agentId) => {
    await api.patch(`/chats/${id}/assign`, { agent: agentId });
    toast.success("Assigned");
    load();
  };

  const sendMail = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/mail/send", mail);
    toast.success(data.simulated ? "Email simulated (configure SMTP)" : "Sent!");
    setMail({ to: "", subject: "", html: "" });
  };

  const createProduct = async (e) => {
    e.preventDefault();
    await api.post("/products", { ...productForm, price: Number(productForm.price) });
    toast.success("Product added");
    setProductForm(emptyProduct);
    load();
  };

  const removeProduct = async (id) => {
    await api.delete(`/products/${id}`);
    toast.success("Product removed");
    load();
  };

  const createCareer = async (e) => {
    e.preventDefault();
    await api.post("/careers", {
      ...careerForm,
      responsibilities: careerForm.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean),
      requirements: careerForm.requirements.split("\n").map((s) => s.trim()).filter(Boolean)
    });
    toast.success("Career posted");
    setCareerForm(emptyCareer);
    load();
  };

  const toggleCareer = async (career) => {
    await api.put(`/careers/${career._id}`, { isActive: !career.isActive });
    toast.success("Career updated");
    load();
  };

  const setApplicationStatus = async (id, status) => {
    await api.patch(`/careers/applications/${id}/status`, { status });
    toast.success("Application updated");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-4">
        <Stat label="Team Ops" value={agents.length + careAgents.length} change="+12%" icon={Users} />
        <Stat label="Messages" value={contacts.length} change="+8%" icon={MessageSquare} />
        <Stat label="Products" value={products.length} change="+6%" icon={Package} />
        <Stat label="Open Roles" value={careers.filter((career) => career.isActive).length} change="+4%" icon={Briefcase} />
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-2">
          {["overview", "analytics", "team", "subscription", "database", "pipelines", "products", "careers", "applications", "mail"].map((item) => (
            <Tab key={item} active={tab === item} onClick={() => setTab(item)}>
              {item === "analytics" && <BarChart3 size={14} className="inline mr-1" />}
              {item === "subscription" && <CreditCard size={14} className="inline mr-1" />}
              {item === "team" && <Users size={14} className="inline mr-1" />}
              {item === "database" && <Database size={14} className="inline mr-1" />}
              {item === "pipelines" && <GitBranch size={14} className="inline mr-1" />}
              {item[0].toUpperCase() + item.slice(1)}
            </Tab>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <div className="grid xl:grid-cols-[1.3fr_0.9fr] gap-4">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Messages</h2>
            <div className="space-y-3">
              {contacts.slice(0, 5).map((c) => (
                <div key={c._id} className="rounded-2xl border border-primary/10 bg-surface/40 px-4 py-4">
                  <div className="font-semibold">{c.subject}</div>
                  <div className="text-xs text-muted mt-1">{c.name} · {c.email}</div>
                  <p className="text-sm text-muted mt-2">{c.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Ticket Routing</h3>
              <div className="space-y-3">
                {tickets.slice(0, 4).map((t) => (
                  <div key={t._id} className="rounded-2xl border border-primary/10 bg-surface/40 px-4 py-4">
                    <div className="font-semibold">{t.subject}</div>
                    <div className="text-xs text-muted mt-1">By {t.createdBy?.name} · {t.priority}</div>
                    <select className="input mt-3" defaultValue={t.assignedTo?._id || ""} onChange={(e) => assignTicket(t._id, e.target.value)}>
                      <option value="">Assign IT Support</option>
                      {agents.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold mb-4">Live Chat Routing</h3>
              <div className="space-y-3">
                {chats.slice(0, 4).map((c) => (
                  <div key={c._id} className="rounded-2xl border border-primary/10 bg-surface/40 px-4 py-4">
                    <div className="font-semibold">{c.customer?.name}</div>
                    <div className="text-xs text-muted mt-1">{c.messages.length} messages · {c.status}</div>
                    <select className="input mt-3" defaultValue={c.agent?._id || ""} onChange={(e) => assignChat(c._id, e.target.value)}>
                      <option value="">Assign Care Agent</option>
                      {careAgents.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-4">
          <form onSubmit={createProduct} className="card space-y-3">
            <div className="flex items-center gap-2">
              <Plus size={18} className="text-primary" />
              <h3 className="text-lg font-bold">Add Product</h3>
            </div>
            <input className="input" placeholder="Product Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
            <input className="input" placeholder="Image URL" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} required />
            <input className="input" type="number" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
            <textarea className="input min-h-[120px]" placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
            <button className="btn-primary w-full">Save Product</button>
          </form>

          <div className="card">
            <h3 className="text-lg font-bold mb-4">Products Listing</h3>
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product._id} className="rounded-2xl border border-primary/10 bg-surface/40 px-4 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-xs text-muted mt-1 truncate">{product.description}</div>
                    <div className="text-accent text-sm font-semibold mt-2">${product.price}</div>
                  </div>
                  <button className="btn-ghost !py-2 !px-4" onClick={() => removeProduct(product._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "careers" && (
        <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-4">
          <form onSubmit={createCareer} className="card space-y-3">
            <h3 className="text-lg font-bold">Post Career</h3>
            <input className="input" placeholder="Role Title" value={careerForm.title} onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })} required />
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="input" placeholder="Department" value={careerForm.department} onChange={(e) => setCareerForm({ ...careerForm, department: e.target.value })} required />
              <input className="input" placeholder="Location" value={careerForm.location} onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })} required />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <select className="input" value={careerForm.type} onChange={(e) => setCareerForm({ ...careerForm, type: e.target.value })}>
                <option value="full_time">Full time</option>
                <option value="part_time">Part time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              <input className="input" placeholder="Experience" value={careerForm.experience} onChange={(e) => setCareerForm({ ...careerForm, experience: e.target.value })} required />
              <input className="input" placeholder="Salary" value={careerForm.salary} onChange={(e) => setCareerForm({ ...careerForm, salary: e.target.value })} required />
            </div>
            <textarea className="input min-h-[90px]" placeholder="Summary" value={careerForm.summary} onChange={(e) => setCareerForm({ ...careerForm, summary: e.target.value })} required />
            <textarea className="input min-h-[120px]" placeholder="Description" value={careerForm.description} onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })} required />
            <textarea className="input min-h-[100px]" placeholder="Responsibilities (one per line)" value={careerForm.responsibilities} onChange={(e) => setCareerForm({ ...careerForm, responsibilities: e.target.value })} />
            <textarea className="input min-h-[100px]" placeholder="Requirements (one per line)" value={careerForm.requirements} onChange={(e) => setCareerForm({ ...careerForm, requirements: e.target.value })} />
            <button className="btn-primary w-full">Publish Career</button>
          </form>

          <div className="card">
            <h3 className="text-lg font-bold mb-4">Career Listings</h3>
            <div className="space-y-3">
              {careers.map((career) => (
                <div key={career._id} className="rounded-2xl border border-primary/10 bg-surface/40 px-4 py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">{career.title}</div>
                    <div className="text-xs text-muted mt-1">{career.department} · {career.location} · {career.type}</div>
                    <div className="text-xs mt-2">
                      <span className={`px-2 py-1 rounded-full ${career.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300"}`}>
                        {career.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                  </div>
                  <button className="btn-ghost !py-2 !px-4" onClick={() => toggleCareer(career)}>
                    {career.isActive ? "Pause" : "Activate"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "applications" && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Career Applications</h3>
          <div className="space-y-3">
            {applications.map((application) => (
              <div key={application._id} className="rounded-2xl border border-primary/10 bg-surface/40 px-4 py-4 flex flex-wrap justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold">{application.fullName}</div>
                  <div className="text-xs text-muted mt-1">{application.email} · {application.phone || "No phone provided"}</div>
                  <div className="text-sm text-muted mt-2">{application.career?.title}</div>
                  {application.coverLetter && <p className="text-sm text-muted mt-2 line-clamp-3">{application.coverLetter}</p>}
                </div>
                <select className="input max-w-[200px]" value={application.status} onChange={(e) => setApplicationStatus(application._id, e.target.value)}>
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
      )}

      {tab === "analytics" && (
        <div className="card">
          <AnalyticsDashboard />
        </div>
      )}

      {tab === "team" && (
        <div className="card">
          <TeamManagement />
        </div>
      )}

      {tab === "subscription" && (
        <div className="card">
          <SubscriptionManager />
        </div>
      )}

      {tab === "database" && (
        <div className="card">
          <DatabaseManagement />
        </div>
      )}

      {tab === "pipelines" && (
        <div className="card">
          <PipelineManager />
        </div>
      )}

      {tab === "mail" && (
        <form onSubmit={sendMail} className="card space-y-3 max-w-3xl">
          <h3 className="text-lg font-bold">Actual Email Send</h3>
          <p className="text-sm text-muted">If `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are filled in your server `.env`, this will send through your actual mail server. Otherwise it will simulate.</p>
          <input className="input" placeholder="To" value={mail.to} onChange={(e) => setMail({ ...mail, to: e.target.value })} required />
          <input className="input" placeholder="Subject" value={mail.subject} onChange={(e) => setMail({ ...mail, subject: e.target.value })} required />
          <textarea className="input min-h-[180px]" placeholder="HTML body" value={mail.html} onChange={(e) => setMail({ ...mail, html: e.target.value })} required />
          <button className="btn-primary"><Send size={16} className="inline mr-2" />Send Email</button>
        </form>
      )}
    </div>
  );
}

function Stat({ label, value, change, icon: Icon }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted">{label}</div>
          <div className="text-3xl font-extrabold mt-2">{value}</div>
          <div className="text-xs text-emerald-400 mt-2">{change}</div>
        </div>
        <div className="w-11 h-11 rounded-2xl grid place-items-center bg-primary/12 border border-primary/20">
          <Icon className="text-primary" size={18} />
        </div>
      </div>
    </div>
  );
}
