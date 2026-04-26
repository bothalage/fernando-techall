import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroLaptop from "../assets/ft-hero-laptop.png";
import { ArrowDownRight, Cloud, Headphones, Rocket } from "lucide-react";

const stats = [
  { v: "50+", l: "Projects Completed" },
  { v: "30+", l: "Happy Clients" },
  { v: "5+", l: "Years Experience" },
  { v: "24/7", l: "IT Support" }
];

const why = [
  { icon: Rocket, t: "Product-grade experiences", d: "Interfaces with clearer hierarchy, stronger contrast and a premium dark dashboard feel." },
  { icon: Headphones, t: "Live service operations", d: "Realtime support, ticketing and customer care flows built into the same product surface." },
  { icon: Cloud, t: "Modern delivery stack", d: "Cloud-ready web systems, internal dashboards and scalable software foundations." }
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10">
      <section className="hero-panel panel-grid px-6 sm:px-8 py-8 sm:py-10">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-10 items-center relative z-10">
          <div>
            <p className="eyebrow mb-5">Technology Studio</p>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] max-w-xl">
              Innovative Tech
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Solutions for the Future</span>
            </motion.h1>

            <p className="mt-5 text-muted max-w-xl text-base sm:text-lg">
              We build modern web applications, mobile apps and provide IT solutions to grow your business with a sharper, premium digital presence.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/services" className="btn-primary">Explore Services</Link>
              <Link to="/contact" className="btn-ghost">Contact Us</Link>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {["A", "B", "C", "D", "E"].map((item, idx) => (
                  <div key={item} className="w-10 h-10 rounded-full border-2 border-bg bg-surface grid place-items-center text-xs font-bold" style={{ zIndex: 6 - idx }}>
                    {item}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">30+ Happy Clients</div>
                <div className="text-muted">Trusted by growing businesses</div>
              </div>
              <ArrowDownRight className="hidden sm:block text-muted" />
            </div>

            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.l} className="card text-center">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{s.v}</div>
                  <div className="text-xs text-muted mt-2">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-accent/20 blur-3xl rounded-full scale-90" />
            <img
              src={heroLaptop}
              alt="Fernando TechAll dashboard and device concept"
              width={1024}
              height={1024}
              className="relative z-10 w-full max-w-[620px] mx-auto drop-shadow-[0_20px_60px_rgba(108,92,255,0.45)]"
            />
          </div>
        </div>
      </section>

      <section className="pt-10 grid md:grid-cols-3 gap-5">
        {why.map(({ icon: Icon, t, d }) => (
          <div key={t} className="card">
            <div className="w-14 h-14 rounded-2xl grid place-items-center bg-primary/12 border border-primary/25">
              <Icon className="text-primary" size={24} />
            </div>
            <h3 className="mt-4 font-bold text-lg">{t}</h3>
            <p className="text-sm text-muted mt-2">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
