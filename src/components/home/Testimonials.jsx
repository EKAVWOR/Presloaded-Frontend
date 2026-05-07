import { useState } from "react";
import { FaStar } from "react-icons/fa";
import tes1 from "../../assets/tes1.jpg";
import tes2 from "../../assets/tes2.jpg";
import tes3 from "../../assets/tes3.jpg";
import tes4 from "../../assets/tes4.jpg";
import tes5 from "../../assets/tes5.jpg";
import tes6 from "../../assets/tes6.jpg";
import tes7 from "../../assets/tes7.jpg";

const testimonials = [
  {
    name: "Adebayo Johnson",
    role: "Full Stack Developer @ TechCorp",
    text: "Presloaded Academy completely transformed my career trajectory. From zero coding experience to landing a full-stack role at TechCorp in just 6 months. The hands-on projects and mentorship were game-changers.",
    avatar: tes1,
    rating: 5,
  },
  {
    name: "Chioma Okafor", 
    role: "Data Analyst @ FinTech Inc",
    text: "The instructors are industry experts who genuinely care about your success. The curriculum is constantly updated with cutting-edge technologies. Best investment I ever made!",
    avatar: tes2,
    rating: 5,
  },
  {
    name: "Emeka Nwosu",
    role: "Mobile Developer @ StartupX",
    text: "95% job placement isn't marketing hype – it's reality. The career services team connected me with recruiters and helped polish my portfolio. Couldn't be happier.",
    avatar: tes3,
    rating: 5,
  },
  {
    name: "Fatima Bello",
    role: "DevOps Engineer @ CloudScale",
    text: "The bootcamp structure is perfect for working professionals. Flexible timings and real AWS/GCP projects helped me transition from sysadmin to DevOps.",
    avatar: tes4,
    rating: 5,
  },
  {
    name: "David Okon",
    role: "Frontend Developer @ E-commerce Co",
    text: "Learned React, Next.js and Tailwind from scratch. Portfolio-ready projects impressed recruiters. Landed remote job within 3 months of graduation.",
    avatar: tes5,
    rating: 5,
  },
  {
    name: "Aisha Mohammed",
    role: "Backend Developer @ FinTech",
    text: "Node.js + PostgreSQL + Docker = dream stack I now master. Mock interviews prepared me perfectly for technical rounds. Highly recommend!",
    avatar: tes6,
    rating: 5,
  },
  {
    name: "Victor Eze",
    role: "Data Scientist @ Analytics Firm",
    text: "Python, ML, and deployment pipelines. Capstone project got featured on my LinkedIn and attracted 3 interview calls. Life-changing!",
    avatar: tes7,
    rating: 5,
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const nextTestimonial = () => setCurrent((current + 1) % testimonials.length);
  const prevTestimonial = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-20 animate-in fade-in-0">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
            Student Success Stories
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto animate-in fade-in-up duration-1000">
            Join 5,000+ graduates thriving in tech careers
          </p>
        </div>

        {/* Main testimonial slider */}
        <div className="relative max-w-4xl mx-auto mb-20">
          <div className="group relative">
            {/* Active testimonial */}
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl p-12 shadow-2xl backdrop-blur-sm border border-white/50 hover:shadow-3xl hover:-translate-y-2 transition-all duration-700 animate-in slide-in-from-bottom">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={testimonials[current].avatar} 
                  alt={testimonials[current].name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-xl ring-4 ring-white/50 group-hover:scale-110 transition-all"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-1">{testimonials[current].name}</h4>
                  <p className="text-primary-600 font-semibold">{testimonials[current].role}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(testimonials[current].rating)].map((_, i) => (
                      <FaStar key={i} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-700 italic leading-relaxed text-2xl md:text-3xl font-light">
                "{testimonials[current].text}"
              </p>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-primary-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Scroll indicators */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 text-sm text-gray-500">
              <span>← Swipe</span>
              <span>or click dots →</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid md:grid-cols-3 gap-8 text-center animate-in fade-in-up delay-400">
          <div className="p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 border border-white/50">
            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">5K+</div>
            <p className="text-lg font-semibold text-gray-700">Happy Graduates</p>
          </div>
          <div className="p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 border border-white/50">
            <div className="text-4xl md:text-5xl font-bold text-accent-500 mb-2">95%</div>
            <p className="text-lg font-semibold text-gray-700">Job Placement</p>
          </div>
          <div className="p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 border border-white/50">
            <div className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2">50+</div>
            <p className="text-lg font-semibold text-gray-700">Programs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
