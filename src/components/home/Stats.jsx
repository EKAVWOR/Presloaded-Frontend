import { FaUsers, FaBookOpen, FaChalkboardTeacher, FaTrophy } from "react-icons/fa";

const stats = [
  { icon: <FaUsers size={28} />, value: "5,000+", label: "Students Trained" },
  { icon: <FaBookOpen size={28} />, value: "50+", label: "Courses Available" },
  { icon: <FaChalkboardTeacher size={28} />, value: "30+", label: "Expert Instructors" },
  { icon: <FaTrophy size={28} />, value: "95%", label: "Success Rate" },
];

const Stats = () => (
  <section className="bg-primary-600 text-white py-16">
    <div className="container-custom">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="flex justify-center mb-3 text-primary-200">{s.icon}</div>
            <p className="text-3xl font-bold mb-1">{s.value}</p>
            <p className="text-primary-200 text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;