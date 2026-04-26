import { useEffect, useState } from "react";
import api from "../api/client";
import Section from "../components/Section.jsx";
import { Code, Smartphone, Palette, Headphones, Cloud, Cpu } from "lucide-react";

const ICONS = { code: Code, smartphone: Smartphone, palette: Palette, headphones: Headphones, cloud: Cloud, cpu: Cpu };

export default function Services() {
  const [items, setItems] = useState([]);

  useEffect(() => { api.get("/services").then(({ data }) => setItems(data)); }, []);

  return (
    <Section eyebrow="Services" title="Our Services">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((s) => {
          const Icon = ICONS[s.icon] || Code;
          return (
            <div key={s._id} className="card">
              <div className="w-14 h-14 rounded-2xl grid place-items-center bg-primary/12 border border-primary/25">
                <Icon className="text-primary" size={22}/>
              </div>
              <h3 className="mt-4 font-bold text-lg">{s.title}</h3>
              <p className="text-sm text-muted mt-2">{s.description}</p>
              <p className="text-xs font-semibold text-accent mt-3">{s.price}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
