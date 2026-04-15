import {
  FaLaptopCode,
  FaUserTie,
  FaCertificate,
  FaHandshake,
  FaClock,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    icon: <FaLaptopCode size={32} />,
    title: "Hands-on Training",
    desc: "Build real-world projects with practical, project-based curriculum.",
  },
  {
    icon: <FaUserTie size={32} />,
    title: "Expert Instructors",
    desc: "Learn from seasoned industry professionals with years of experience.",
  },
  {
    icon: <FaCertificate size={32} />,
    title: "Recognized Certificates",
    desc: "Earn industry-recognized certificates upon completion.",
  },
  {
    icon: <FaHandshake size={32} />,
    title: "Job Placement Support",
    desc: "Get connected with top tech companies through our career services.",
  },
  {
    icon: <FaClock size={32} />,
    title: "Flexible Schedules",
    desc: "Choose weekday or weekend classes that fit your schedule.",
  },
  {
    icon: <FaHeadset size={32} />,
    title: "Lifetime Support",
    desc: "Access our alumni community and ongoing mentorship after graduation.",
  },
];

const WhyChooseUs = () => (
  <section className="section-padding">
    <div className="container-custom">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We are committed to delivering world-class tech education that transforms careers.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-lg hover:border-primary-100 transition-all duration-300 group"
          >
            <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;