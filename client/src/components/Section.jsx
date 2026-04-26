import { motion } from "framer-motion";

export default function Section({ title, eyebrow, children, className = "" }) {
  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 ${className}`}>
      <div className="section-shell rounded-[26px] p-6 sm:p-8 panel-grid">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold mb-8"
          >
            {title}
          </motion.h2>
        )}
        {children}
      </div>
    </section>
  );
}
