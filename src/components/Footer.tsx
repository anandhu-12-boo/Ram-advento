import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { contact } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-forest-deep pb-24 lg:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            <BrandLogo size={64} />
            <div>
              <p className="font-display text-2xl text-mist">RAM ADVENTURE</p>
              <p className="eyebrow">Munnar Jeep Safari & Tours</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm text-mist/70">
            Adventure begins where the road ends. Local drivers, adventure-ready jeeps and the
            routes only Munnar's own people know.
          </p>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-mist/75">
            <li><Link to="/safari" className="hover:text-sand">Jeep Safari</Link></li>
            <li><Link to="/tours" className="hover:text-sand">Tour Packages</Link></li>
            <li><Link to="/gallery" className="hover:text-sand">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-sand">About Us</Link></li>
            <li><Link to="/book" className="hover:text-sand">Book Now</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Reach us</p>
          <ul className="mt-4 space-y-3 text-sm text-mist/75">
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 text-sand" /> {contact.phone}
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 text-sand" /> {contact.email}
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-sand" /> {contact.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="trail-divider" />
      <p className="px-6 py-6 text-center text-xs tracking-widest text-mist/45 uppercase">
        © {new Date().getFullYear()} Ram Adventure • Munnar, Kerala
      </p>
    </footer>
  );
}
