import { Link } from "react-router-dom";
import {
  FaCode,
  FaMobileAlt,
  FaDatabase,
  FaPaintBrush,
  FaShieldAlt,
  FaCloud,
  FaArrowRight,
  FaVideo
} from "react-icons/fa";
import { SiMaterialdesignicons } from "react-icons/si"
import img1 from "../../assets/img1.jpg";

const programs = [
  { 
    icon: <FaCode size={36} />, 
    name: "Web Development", 
    color: "from-blue-500 to-indigo-600", 
    desc: "Frontend & Backend",
    img: img1
  },
  { 
    icon: <FaMobileAlt size={36} />, 
    name: "Mobile Development", 
    color: "from-emerald-500 to-teal-600", 
    desc: "iOS & Android",
    img: img1
  },
  { 
    icon: <FaVideo  size={36} />, 
    name: "Cinematography", 
    color: "from-purple-500 to-violet-600", 
    desc: "Photography & Videography",
    img: img1
  },
  { 
    icon: <FaPaintBrush size={36} />, 
    name: "UI/UX Design", 
    color: "from-pink-500 to-rose-600", 
    desc: "Figma & Adobe",
    img: img1
  },
  { 
    icon: <FaShieldAlt size={36} />, 
    name: "Cybersecurity", 
    color: "from-red-500 to-orange-600", 
    desc: "Ethical Hacking",
    img: img1
  },
  { 
    icon: <SiMaterialdesignicons size={36} />, 
    name: "Graphic design", 
    color: "from-yellow-500 to-amber-600", 
    desc: "Photoshop, Pixellab, Canva",
    img: img1
  },
];

const Programs = () => (
  <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50 via-white to-blue-50 relative overflow-hidden">
    
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-5">
      <img src={img1} alt="" className="w-full h-full object-cover" />
    </div>

    <div className="container-custom relative z-10">

      {/* Section Header */}
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-700 to-blue-600 bg-clip-text text-transparent">
          Professional Programs
        </h2>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          Choose from our industry-leading certification programs
        </p>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {programs.map((program, i) => (
          <Link
            to={`/courses?category=${encodeURIComponent(program.name)}`}
            key={i}
            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:bg-white hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-white/50 hover:border-blue-200"
          >

            {/* Gradient glow */}
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${program.color} opacity-0 group-hover:opacity-20 transition-opacity blur-xl -z-10 group-hover:scale-150`}
            />

            {/* Icon */}
            <div
              className={`w-20 h-20 bg-gradient-to-r ${program.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl text-white group-hover:scale-110 transition-all duration-500`}
            >
              {program.icon}
            </div>

            {/* Title */}
            <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-2 text-center group-hover:text-gray-900">
              {program.name}
            </h4>

            {/* Subtitle */}
            <p className="text-xs md:text-sm text-gray-500 text-center group-hover:text-gray-600">
              {program.desc}
            </p>

            {/* Hover Arrow */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all delay-200">
              <FaArrowRight className="text-gray-600 text-sm" />
            </div>

          </Link>
        ))}
      </div>

    </div>
  </section>
);

export default Programs;