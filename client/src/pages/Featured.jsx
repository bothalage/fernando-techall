import { useEffect, useState } from "react";
import api from "../api/client";
import Section from "../components/Section.jsx";

export default function Featured() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/portfolio/featured").then(({ data }) => setItems(data)).catch(() => {});
  }, []);

  return (
    <Section eyebrow="Showcase" title="Featured Work">
      <div className="grid lg:grid-cols-3 gap-5">
        {items.map((p) => (
          <div key={p._id} className="card p-3">
            <div className="rounded-2xl overflow-hidden border border-primary/10">
              <img src={p.image} alt={p.title} className="rounded-2xl h-52 w-full object-cover" />
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <p className="text-sm text-muted mt-2">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
