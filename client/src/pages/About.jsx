import { useMemo } from "react";
import { motion } from "framer-motion";
import Section from "../components/Section.jsx";
import { Eye, Target, Award, Linkedin, Mail } from "lucide-react";
import teamOffice from "../assets/ft-team-office.jpg";

const pillars = [
  { icon: Eye, t: "Vision", d: "To be a global leader in technology innovation." },
  { icon: Target, t: "Mission", d: "Deliver reliable and affordable tech solutions." },
  { icon: Award, t: "Value", d: "Integrity, quality and exceptional support." }
];

const boardMembers = [
  { name: "Fernando Silva", role: "Managing Director", bio: "Leads strategy, partnerships and platform growth across the group.", accent: "from-primary to-accent" },
  { name: "Nadeesha Perera", role: "Operations Director", bio: "Drives delivery excellence, client success and internal systems.", accent: "from-cyan-500 to-primary" },
  { name: "Shanika Dias", role: "Technology Director", bio: "Owns engineering quality, architecture and AI-driven product delivery.", accent: "from-fuchsia-500 to-accent" }
];

const partners = ["Google", "Meta", "Microsoft", "Stripe", "AWS"];

function PartnerRow() {
  const items = useMemo(() => [...partners, ...partners], []);
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/10 bg-surface/30">
      <motion.div
        className="flex gap-4 py-4 px-4 min-w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {items.map((name, index) => (
          <div key={`${name}-${index}`} className="px-6 py-3 rounded-2xl bg-surface/70 border border-primary/10 text-sm font-semibold tracking-wide text-text/90">
            {name}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function About() {
  return (
    <div className="space-y-2">
      <Section eyebrow="About" title="We Are Fernando TechAll">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
          <div className="card p-3">
            <img loading="lazy" width={1280} height={832} className="rounded-2xl border border-primary/20 w-full h-auto" src={teamOffice} alt="Fernando TechAll team at the office" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">We build digital products, service systems and support operations that feel premium from the first screen.</h3>
            <p className="text-muted mt-4">Fernando TechAll is a technology company delivering product design, software engineering, IT support, careers growth systems and customer operations for ambitious brands. We focus on business-ready experiences that feel modern, credible and premium.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">
              {pillars.map(({ icon: Icon, t, d }) => (
                <div key={t} className="card">
                  <div className="w-12 h-12 rounded-2xl grid place-items-center bg-primary/12 border border-primary/25">
                    <Icon className="text-primary" size={18} />
                  </div>
                  <h3 className="mt-4 font-semibold">{t}</h3>
                  <p className="text-xs text-muted mt-2">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Leadership" title="Board of Directors">
        <div className="grid lg:grid-cols-3 gap-5">
          {boardMembers.map((member) => (
            <div key={member.name} className="card">
              <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${member.accent} p-[1px]`}>
                <div className="w-full h-full rounded-3xl bg-bg flex items-center justify-center text-xl font-extrabold">
                  {member.name.split(" ").map((part) => part[0]).join("")}
                </div>
              </div>
              <h3 className="mt-5 text-xl font-bold">{member.name}</h3>
              <p className="text-accent text-sm font-semibold mt-1">{member.role}</p>
              <p className="text-sm text-muted mt-3">{member.bio}</p>
              <div className="mt-5 flex gap-2">
                <span className="btn-ghost !py-2 !px-3"><Linkedin size={14} /></span>
                <span className="btn-ghost !py-2 !px-3"><Mail size={14} /></span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Partners" title="Trusted Technology Partners">
        <p className="text-muted max-w-2xl mb-6">We design, build and operate products using globally trusted platforms and delivery partners. Here are a few of the ecosystems we align with.</p>
        <PartnerRow />
      </Section>
    </div>
  );
}
