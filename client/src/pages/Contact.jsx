import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client";
import Section from "../components/Section.jsx";
import { MapPin, Phone, Mail, MessageCircle, Send, Github, Linkedin } from "lucide-react";

export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/contact", f);
      toast.success("Message sent!");
      setF({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <Section eyebrow="Contact" title="Get in Touch">
      <div className="grid lg:grid-cols-[0.88fr_1.12fr] gap-8">
        <div className="card space-y-4">
          <h3 className="font-bold text-xl">Contact Info</h3>
          <p className="flex items-center gap-3 text-muted"><MapPin size={18} className="text-primary"/> 537, Thalahena, Negombo, Sri Lanka</p>
          <p className="flex items-center gap-3 text-muted"><Phone size={18} className="text-primary"/> +94 76 186 4769</p>
          <p className="flex items-center gap-3 text-muted"><Mail size={18} className="text-primary"/> info@fernandotechall.com</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a className="btn-primary" href="https://wa.me/94761864769"><MessageCircle size={16} className="inline mr-1"/>WhatsApp</a>
            <a className="btn-ghost" href="https://t.me/+94761864769"><Send size={16} className="inline mr-1"/>Telegram</a>
            <a className="btn-ghost" href="https://github.com/fernandotechall"><Github size={16}/></a>
            <a className="btn-ghost" href="https://linkedin.com/company/fernandotechall"><Linkedin size={16}/></a>
          </div>
        </div>

        <form onSubmit={submit} className="card space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input className="input" placeholder="Your Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required/>
            <input className="input" type="email" placeholder="Your Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required/>
          </div>
          <input className="input" placeholder="Subject" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} required/>
          <textarea className="input min-h-[160px]" placeholder="Your Message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} required/>
          <button disabled={sending} className="btn-primary w-full">{sending ? "Sending..." : "Send Message"}</button>
        </form>
      </div>
    </Section>
  );
}
