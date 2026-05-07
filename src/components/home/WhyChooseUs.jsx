import { FaLaptopCode, FaUserTie, FaCertificate, FaHandshake, FaClock, FaHeadset, FaArrowRight } from "react-icons/fa";
import img2 from "../../assets/img2.jpg";

const features = [
  { icon: <FaLaptopCode size={40} />, title: "Hands-on Training", desc: "Build real-world projects with our practical, project-based curriculum that mirrors industry standards.", delay: "0" },
  { icon: <FaUserTie size={40} />, title: "Expert Instructors", desc: "Learn from industry veterans with 10+ years experience and proven track records.", delay: "200" },
  { icon: <FaCertificate size={40} />, title: "Industry Certificates", desc: "Earn globally recognized certificates that boost your professional credibility.", delay: "400" },
  { icon: <FaHandshake size={40} />, title: "Job Placement", desc: "90% placement rate with direct connections to top tech companies.", delay: "600" },
  { icon: <FaClock size={40} />, title: "Flexible Learning", desc: "Weekday, weekend, or self-paced – choose what fits your schedule.", delay: "800" },
  { icon: <FaHeadset size={40} />, title: "Lifetime Support", desc: "Join our alumni network for ongoing mentorship and career guidance.", delay: "1000" },
];

const WhyChooseUs = () => (
  <section className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundImage: `url(${img2})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/70" />
    <div className="container-custom relative z-10">
      <div className="text-center mb-20 animate-in fade-in-0">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent drop-shadow-2xl">
          Why Choose Presloaded?
        </h2>
        <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed animate-in fade-in-up duration-1000">
          World-class training that delivers results – trusted by thousands of professionals.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-10 hover:bg-white/90 hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 hover:border-primary-300 animate-in fade-in-up"
            style={{ "--delay": `${feature.delay}ms` }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-primary-500/25">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-800 transition">{feature.title}</h3>
            <p className="text-primary-100 leading-relaxed group-hover:text-gray-700 transition">{feature.desc}</p>
            <div className="mt-6 pt-6 border-t border-white/20 group-hover:border-gray-200 transition">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-300 group-hover:text-primary-600">
                Learn More <FaArrowRight className="group-hover:translate-x-1 transition" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
