import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { ACADEMY_NAME, SOCIAL_LINKS, WHATSAPP_NUMBER } from "../../../utils/constants";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              
                <img src="/src/assets/logo.png" alt="" />
              </div>
              <span className="text-xl font-bold text-white">{ACADEMY_NAME}</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Empowering the next generation of tech professionals through
              world-class training programs, both online and in-person.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FaFacebookF />, url: SOCIAL_LINKS.facebook },
                { icon: <FaTwitter />, url: SOCIAL_LINKS.twitter },
                { icon: <FaInstagram />, url: SOCIAL_LINKS.instagram },
                { icon: <FaLinkedinIn />, url: SOCIAL_LINKS.linkedin },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["About Us", "Courses", "Contact", "FAQ"].map((name) => (
                <li key={name}>
                  <Link
                    to={`/${name.toLowerCase().replace(/\s/g, "-")}`}
                    className="hover:text-primary-400 transition"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold mb-4">Programs</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Web Development",
                "Data Science",
                "Mobile Development",
                "UI/UX Design",
                "Cybersecurity",
              ].map((name) => (
                <li key={name}>
                  <Link to="/courses" className="hover:text-primary-400 transition">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-primary-400" />
                <span>Back Sudoz Filling Station, Opp Word of Life Campus Fellowship, Abraka, Delta State</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary-400" />
                <a href="tel:+2348012345678" className="hover:text-primary-400">
                  +2347079737566
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary-400" />
                <a href="mailto:info@techacademy.com" className="hover:text-primary-400">
                  presloadedacademy@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} {ACADEMY_NAME}. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-primary-400">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-400">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* WhatsApp Float */}
      {WHATSAPP_NUMBER && (
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition"
        >
          <FaWhatsapp size={28} className="text-white" />
        </a>
      )}
    </footer>
  );
};

export default Footer;