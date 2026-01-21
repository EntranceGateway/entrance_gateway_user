import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Send } from "lucide-react";

const PLATFORM_LINKS = [
  { name: "About Us", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Careers", path: "/careers" },
];

const SUPPORT_LINKS = [
  { name: "Help Center", path: "/help" },
  { name: "Terms of Service", path: "/terms" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "FAQs", path: "/faqs" },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-surface-dark text-gray-300 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-icons-round text-primary text-3xl">school</span>
              <span className="font-display font-bold text-2xl text-white tracking-tight">EntranceGateway</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 pr-4">
              EntranceGateway is Nepal's premier digital learning platform dedicated to helping students ace their entrance examinations with confidence and clarity.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-accent transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-white font-bold text-lg mb-6">Platform</h3>
            <ul className="space-y-4 text-sm">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-lg mb-6">Get in Touch</h3>
            <ul className="space-y-4 text-sm mb-6">
              <li className="flex items-start gap-3 text-gray-400">
                <span className="material-icons-round text-primary text-lg mt-0.5">location_on</span>
                <span>Putalisadak, Kathmandu,<br />Nepal</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <span className="material-icons-round text-primary text-lg">phone</span>
                <span>+977 9800000000</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <span className="material-icons-round text-primary text-lg">email</span>
                <span>info@entrancegateway.com</span>
              </li>
            </ul>
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-none rounded-xl text-sm w-full py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
                placeholder="Subscribe to newsletter"
              />
              <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-accent rounded-lg px-3 hover:bg-yellow-400 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2025 EntranceGateway. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            <Link to="/security" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
