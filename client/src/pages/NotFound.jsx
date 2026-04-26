import { Link } from "react-router-dom";
import astronaut from "../assets/ft-astronaut-404.jpg";

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <section className="hero-panel panel-grid grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center p-6 sm:p-8 lg:p-10 overflow-hidden">
        <div className="relative z-10">
          <p className="eyebrow mb-4">404 Page</p>
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">404</h1>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3">Page Not Found</h2>
          <p className="text-muted mt-3 max-w-sm">Oops! The page you are looking for does not exist.</p>
          <Link to="/" className="btn-primary inline-block mt-7">Go Back Home</Link>
        </div>
        <div className="relative z-10">
          <img loading="lazy" src={astronaut} alt="Lost astronaut" width={1024} height={1024} className="rounded-[28px] w-full h-auto border border-primary/20 shadow-[0_24px_60px_rgba(0,0,0,0.35)]" />
        </div>
      </section>
    </div>
  );
}
