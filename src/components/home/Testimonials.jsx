import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import tes1 from "../../assets/tes1.jpg";
import tes2 from "../../assets/tes2.jpg";
import tes3 from "../../assets/tes3.jpg";
import tes4 from "../../assets/tes4.jpg";
import tes5 from "../../assets/tes5.jpg";
import tes6 from "../../assets/tes6.jpg";
import tes7 from "../../assets/tes7.jpg";

const slides = [tes1, tes2, tes3, tes4, tes5, tes6, tes7];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container-custom">

        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 text-sm font-semibold rounded-full mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Student Success Stories
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Meet our amazing students building successful careers in tech.
          </p>
        </div>

        {/* Slider Wrapper */}
        <div className="relative max-w-3xl mx-auto">

          {/* Slide Window */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-xl ring-1 ring-gray-200/50">
            
            {/* Slides Track */}
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides.map((img, i) => (
                <div key={i} className="min-w-full">
                  <img
                    src={img}
                    alt={`Testimonial ${i + 1}`}
                    className="w-full h-auto block"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md 
                            text-white text-xs font-semibold px-3 py-1.5 rounded-full
                            tracking-wider">
              {String(current + 1).padStart(2, "0")} 
              <span className="opacity-50 mx-1">/</span> 
              {String(slides.length).padStart(2, "0")}
            </div>
          </div>

          {/* Prev Button — outside the image */}
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute top-1/2 -left-4 md:-left-7 -translate-y-1/2 
                       w-12 h-12 md:w-14 md:h-14 rounded-full 
                       bg-white shadow-xl ring-1 ring-gray-200
                       flex items-center justify-center text-gray-700 
                       hover:bg-primary-600 hover:text-white hover:scale-110
                       active:scale-95 transition-all duration-300 z-10"
          >
            <FaChevronLeft size={14} />
          </button>

          {/* Next Button — outside the image */}
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute top-1/2 -right-4 md:-right-7 -translate-y-1/2 
                       w-12 h-12 md:w-14 md:h-14 rounded-full 
                       bg-white shadow-xl ring-1 ring-gray-200
                       flex items-center justify-center text-gray-700 
                       hover:bg-primary-600 hover:text-white hover:scale-110
                       active:scale-95 transition-all duration-300 z-10"
          >
            <FaChevronRight size={14} />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  current === i
                    ? "w-10 bg-primary-600"
                    : "w-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 max-w-xs mx-auto h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              key={current}
              className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"
              style={{
                animation: "progress 5s linear forwards",
              }}
            />
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {[
            { value: "5K+", label: "Happy Graduates", color: "from-primary-500 to-primary-700" },
            { value: "95%", label: "Job Placement",   color: "from-emerald-500 to-emerald-700" },
            { value: "50+", label: "Programs",        color: "from-orange-500 to-orange-700"  },
          ].map(({ value, label, color }) => (
            <div
              key={label}
              className="group bg-white rounded-2xl p-8 text-center shadow-md 
                         hover:shadow-2xl transition-all duration-500 hover:-translate-y-2
                         ring-1 ring-gray-100"
            >
              <h3 className={`text-5xl font-bold mb-2 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                {value}
              </h3>
              <p className="text-gray-600 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inline keyframes for the progress bar */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;