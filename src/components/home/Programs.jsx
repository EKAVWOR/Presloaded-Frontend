import { Link } from "react-router-dom";
import {
  FaCode,
  FaMobileAlt,
  FaDatabase,
  FaPaintBrush,
  FaShieldAlt,
  FaCloud,
} from "react-icons/fa";

const programs = [
  { icon: <FaCode size={36} />, name: "Web Development", color: "bg-blue-50 text-blue-600" },
  { icon: <FaMobileAlt size={36} />, name: "Mobile Development", color: "bg-green-50 text-green-600" },
  { icon: <FaDatabase size={36} />, name: "Data Science", color: "bg-purple-50 text-purple-600" },
  { icon: <FaPaintBrush size={36} />, name: "UI/UX Design", color: "bg-pink-50 text-pink-600" },
  { icon: <FaShieldAlt size={36} />, name: "Cybersecurity", color: "bg-red-50 text-red-600" },
  { icon: <FaCloud size={36} />, name: "Cloud Computing", color: "bg-yellow-50 text-yellow-600" },
];

const Programs = () => (
  <section className="section-padding bg-gray-50">
    <div className="container-custom">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Programs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from a wide range of tech disciplines.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {programs.map((p, i) => (
          <Link
            to={`/courses?category=${encodeURIComponent(p.name)}`}
            key={i}
            className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition group"
          >
            <div
              className={`w-16 h-16 ${p.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
            >
              {p.icon}
            </div>
            <p className="text-sm font-semibold text-gray-700">{p.name}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Programs;