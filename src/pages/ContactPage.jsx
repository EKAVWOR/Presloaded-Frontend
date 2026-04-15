import { useState } from "react";
import { submitContact } from "../services/contactService";
import toast from "react-hot-toast";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaWhatsapp,
} from "react-icons/fa";
import { WHATSAPP_NUMBER } from "../../utils/constants";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, title: "Address", detail: "123 Tech Avenue, Ikeja, Lagos" },
    { icon: <FaPhone />, title: "Phone", detail: "+234 801 234 5678" },
    { icon: <FaEnvelope />, title: "Email", detail: "info@techacademy.com" },
    { icon: <FaClock />, title: "Hours", detail: "Mon – Fri: 9AM – 5PM" },
  ];

  return (
    <>
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-primary-100 text-lg">We'd love to hear from you</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Info */}
            <div className="space-y-6">
              {contactInfo.map((c, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{c.title}</h3>
                    <p className="text-gray-600 text-sm">{c.detail}</p>
                  </div>
                </div>
              ))}
              {WHATSAPP_NUMBER && (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition"
                >
                  <FaWhatsapp size={20} /> Chat on WhatsApp
                </a>
              )}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                    className="input-field"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    className="input-field resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;