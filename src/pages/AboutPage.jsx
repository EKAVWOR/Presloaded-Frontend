import { FaBullseye, FaEye, FaGem } from "react-icons/fa";
import CTA from "../components/home/CTA";

const AboutPage = () => (
  <>
    {/* Header */}
    <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-20">
      <div className="container-custom text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        <p className="text-primary-100 max-w-2xl mx-auto text-lg">
          Building the next generation of tech leaders in Africa.
        </p>
      </div>
    </section>

    {/* Story */}
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded with a passion for bridging the tech skills gap, Tech Academy
              has grown to become one of the leading technology training institutions.
              We provide both in-person and online courses designed to equip students
              with the skills employers demand.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our curriculum is constantly updated to reflect the latest industry trends,
              ensuring our graduates are always ahead of the curve. Whether you prefer
              learning in a classroom setting or the flexibility of online learning,
              we have a programme for you.
            </p>
          </div>
          <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
            <span className="text-gray-400 text-lg">Academy Photo</span>
          </div>
        </div>
      </div>
    </section>

    {/* Mission, Vision, Values */}
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaBullseye size={36} />,
              title: "Our Mission",
              desc: "To provide accessible, world-class tech education that empowers individuals to build successful careers in technology.",
            },
            {
              icon: <FaEye size={36} />,
              title: "Our Vision",
              desc: "To be Africa's leading technology training academy, producing globally competitive tech professionals.",
            },
            {
              icon: <FaGem size={36} />,
              title: "Our Values",
              desc: "Excellence, innovation, integrity, and a commitment to every student's success drive everything we do.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="text-primary-600 flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <CTA />
  </>
);

export default AboutPage;