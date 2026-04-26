import { useEffect, useState } from "react";
import api from "../api/client";
import Section from "../components/Section.jsx";
import ecommerce from "../assets/ft-work-ecommerce.jpg";
import task from "../assets/ft-work-task.jpg";
import fintech from "../assets/ft-work-fintech.jpg";
import hotel from "../assets/ft-work-hotel.jpg";
import learning from "../assets/ft-work-learning.jpg";
import fitness from "../assets/ft-work-fitness.jpg";

const FALLBACK = [
  { _id: "1", title: "E-Commerce Platform", description: "Full stack e-commerce solution.", image: ecommerce },
  { _id: "2", title: "Task Management App", description: "Productivity and task tracking.", image: task },
  { _id: "3", title: "Fintech Dashboard", description: "Financial analytics dashboard.", image: fintech },
  { _id: "4", title: "Hotel Booking App", description: "Online hotel reservation system.", image: hotel },
  { _id: "5", title: "Learning Management", description: "Online courses and education platform.", image: learning },
  { _id: "6", title: "Health and Fitness App", description: "Fitness tracking application.", image: fitness }
];

export default function Portfolio() {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    api.get("/portfolio").then(({ data }) => {
      if (Array.isArray(data) && data.length) setItems(data);
    }).catch(() => {});
  }, []);

  return (
    <Section eyebrow="Portfolio" title="Our Work">
      <div className="flex flex-wrap gap-3 mb-6">
        {["All", "Web Apps", "Mobile Apps", "Design", "Software"].map((filter, index) => (
          <span key={filter} className={`px-4 py-2 rounded-xl text-sm border ${index === 0 ? "bg-primary/20 text-text border-primary/35" : "bg-surface/60 text-muted border-primary/10"}`}>
            {filter}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((p) => (
          <div key={p._id} className="card overflow-hidden group p-3">
            <div className="overflow-hidden rounded-2xl border border-primary/10">
              <img loading="lazy" src={p.image} alt={p.title} width={800} height={576} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            <h3 className="mt-4 font-semibold">{p.title}</h3>
            <p className="text-sm text-muted mt-1">{p.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
