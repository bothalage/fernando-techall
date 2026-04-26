import { useEffect, useState } from "react";
import api from "../api/client";
import Section from "../components/Section.jsx";
import { Star, Quote } from "lucide-react";

export default function Experience() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/testimonials").then(({ data }) => setItems(data)).catch(() => {});
  }, []);

  return (
    <Section eyebrow="Testimonials" title="Client Experience">
      <div className="grid lg:grid-cols-3 gap-5">
        {items.map((t) => (
          <div key={t._id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={t.avatar} className="w-12 h-12 rounded-full border border-primary/20" alt={t.name} />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted">{t.company}</div>
                </div>
              </div>
              <Quote className="text-primary/60" size={18} />
            </div>
            <div className="flex mt-4 text-primary">
              {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-sm text-muted mt-3 leading-6">"{t.message}"</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
