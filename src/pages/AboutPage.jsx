import { FaBullseye, FaEye, FaGem, FaUsers, FaLaptopCode, FaBriefcase } from "react-icons/fa";
import CTA from "../components/home/CTA";
import img1 from "../../src/assets/img1.jpg";
import img2 from "../../src/assets/img2.jpg";
import img3 from "../../src/assets/img3.jpg";

const AboutPage = () => {
  const promiseCards = [
    {
      icon: <FaBullseye size={30} className="text-primary-300" />,
      title: "Our Mission",
      desc: "To make world-class tech education accessible, practical, and transformative for ambitious Africans ready to build meaningful careers in technology.",
    },
    {
      icon: <FaEye size={30} className="text-accent-400" />,
      title: "Our Vision",
      desc: "To become Africa’s leading academy for producing globally competitive developers, designers, analysts, and digital innovators.",
    },
    {
      icon: <FaGem size={30} className="text-emerald-400" />,
      title: "Our Values",
      desc: "Excellence, innovation, integrity, consistency, and student success are the standards that shape every learning experience we deliver.",
    },
  ];

  const stats = [
    { icon: <FaUsers />, value: "5,000+", label: "Graduates Trained" },
    { icon: <FaLaptopCode />, value: "50+", label: "Programs & Courses" },
    { icon: <FaBriefcase />, value: "95%", label: "Career Readiness Focus" },
  ];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-24 md:py-32">
        {/* Background glows */}
        <div className="absolute top-[-120px] right-[-100px] w-[420px] h-[420px] bg-primary-400/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-120px] left-[-100px] w-[360px] h-[360px] bg-accent-500/20 blur-[120px] rounded-full pointer-events-none" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_30%)]" />

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6 border border-white/20">
              🚀 Empowering Africa Through Tech Education
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Building the Next Generation of
              <span className="block bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent">
                Tech Leaders in Africa
              </span>
            </h1>

            <p className="text-primary-100 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
              At Presloaded Academy, we don’t just teach skills — we help students
              build confidence, real-world experience, and career pathways into the
              tech industry through practical learning and mentorship.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 text-center shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center text-primary-300 text-xl">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <p className="text-primary-200 mt-2 text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="relative py-24 md:py-32 bg-[#070B14] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-primary-200 mb-6">
                Our Story
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                From Passion to
                <span className="block text-primary-300">Purpose-Driven Impact</span>
              </h2>

              <p className="text-primary-100 text-lg leading-relaxed mb-6">
                Presloaded Academy was founded with a clear mission: to bridge the
                tech skills gap by giving young people and aspiring professionals
                access to practical, industry-relevant training that actually leads
                somewhere.
              </p>

              <p className="text-primary-200 leading-relaxed mb-8">
                We saw too many learners consuming random tutorials without direction,
                mentorship, or career outcomes. So we created an academy focused on
                structure, accountability, and hands-on experience — one that helps
                students move from confusion to clarity, and from learning to earning.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-primary-300 mb-2">Practical Learning</h3>
                  <p className="text-primary-200 text-sm leading-relaxed">
                    Every program is designed with real projects and skill application in mind.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-primary-300 mb-2">Career Growth</h3>
                  <p className="text-primary-200 text-sm leading-relaxed">
                    We focus on helping students become job-ready, confident, and globally relevant.
                  </p>
                </div>
              </div>
            </div>

            {/* Right images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={img1}
                  alt="Presloaded Academy learning environment"
                  className="w-full h-64 md:h-72 object-cover rounded-2xl shadow-2xl border border-white/10 hover:scale-[1.03] transition-all duration-500"
                  loading="lazy"
                />
                <img
                  src={img2}
                  alt="Students in practical training"
                  className="w-full h-64 md:h-72 object-cover rounded-2xl shadow-2xl border border-white/10 mt-10 hover:scale-[1.03] transition-all duration-500"
                  loading="lazy"
                />
              </div>

              <div className="relative -mt-8 mx-auto w-[85%]">
                <img
                  src={img3}
                  alt="Presloaded Academy success moment"
                  className="w-full h-52 md:h-64 object-cover rounded-2xl shadow-2xl border border-white/10 hover:scale-[1.03] transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute -bottom-5 -right-5 bg-accent-500 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl">
                  Trusted by aspiring tech talents
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROMISE ================= */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-primary-900 to-[#0B1220] text-white">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm text-primary-200 mb-5">
              Our Promise
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              What We Stand For
            </h2>
            <p className="text-primary-200 text-lg leading-relaxed">
              Our academy is built on a strong foundation of purpose, student success,
              and long-term impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {promiseCards.map((item, i) => (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 hover:bg-white/10 hover:border-primary-400/30 hover:-translate-y-2 transition-all duration-500 shadow-xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-bold mb-4 text-white">
                  {item.title}
                </h3>

                <p className="text-primary-200 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY WE EXIST ================= */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Presloaded Academy Exists
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Because talent is everywhere, but access, structure, and opportunity are not.
              We exist to close that gap and help students unlock real possibilities in tech.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Structured Learning",
                desc: "No more random tutorials. Our learning paths are built to take students from beginner to confident professional.",
              },
              {
                title: "Industry-Relevant Skills",
                desc: "We teach what matters in the real world, using practical tools, current workflows, and project-based experience.",
              },
              {
                title: "Mentorship & Support",
                desc: "Students get access to guidance, accountability, and a support system that keeps them moving forward.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default AboutPage;