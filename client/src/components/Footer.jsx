import { Github, Linkedin, MessageCircle, Send, MapPin, Mail, Phone, Hexagon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 mt-10">
      <div className="glass rounded-[26px] px-6 sm:px-8 py-8">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8">
          <div>
            <div className="flex items-center gap-3 font-extrabold tracking-tight text-lg">
              <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary/15 border border-primary/35">
                <Hexagon className="text-primary" size={20} />
              </span>
              <span>FERNANDO <span className="text-accent">TECHALL</span></span>
            </div>
            <p className="text-muted text-sm mt-4 max-w-sm">We provide modern web solutions, IT support, careers growth systems and innovative software for your business.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>Home</li>
              <li>About Us</li>
              <li>Services</li>
              <li>Portfolio</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Our Services</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>Web Development</li>
              <li>Mobile Development</li>
              <li>UI/UX Design</li>
              <li>IT Support</li>
              <li>Cloud Solutions</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact Info</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2"><MapPin size={14} /> 537, Thalahena, Negombo, Sri Lanka</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +94 76 186 4769</li>
              <li className="flex items-center gap-2"><Mail size={14} /> info@fernandotechall.com</li>
              <li className="flex items-center gap-3 pt-2">
                <a href="https://wa.me/94761864769" className="hover:text-primary"><MessageCircle size={18} /></a>
                <a href="https://t.me/+94761864769" className="hover:text-primary"><Send size={18} /></a>
                <a href="https://github.com/fernandotechall" className="hover:text-primary"><Github size={18} /></a>
                <a href="https://linkedin.com/company/fernandotechall" className="hover:text-primary"><Linkedin size={18} /></a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-primary/10 text-xs text-muted flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <span>Newsletter and support-ready company site UI</span>
          <span>© 2026 Fernando TechAll. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
