import { useEffect, useState } from "react";
import api from "../api/client";
import Section from "../components/Section.jsx";
import { ShoppingBag } from "lucide-react";

export default function Products() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/products").then(({ data }) => setItems(data)).catch(() => {});
  }, []);

  return (
    <Section eyebrow="Products" title="Our Products">
      <div className="grid lg:grid-cols-3 gap-5">
        {items.map((p) => (
          <div key={p._id} className="card p-3">
            <div className="rounded-2xl overflow-hidden border border-primary/10">
              <img src={p.image} alt={p.name} className="h-48 w-full object-cover" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-muted mt-2">{p.description}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl grid place-items-center bg-primary/12 border border-primary/20">
                <ShoppingBag className="text-primary" size={16} />
              </div>
            </div>
            <div className="mt-4 text-accent font-bold">${p.price}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
