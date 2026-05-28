import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaArrowRight, FaTimes } from "react-icons/fa";

const Hero = () => {
  const [statsVisible, setStatsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ React state for modal
  const [counterValues, setCounterValues] = useState({
    graduates: 0,
    courses: 0,
    placement: 0,
  });

  const glow1Ref = useRef(null);
  const glow2Ref = useRef(null);
  const statsRef = useRef(null);

  // ✅ Counter animation using React state properly
  useEffect(() => {
    if (!statsVisible) return;

    const duration = 2000;
    const targets = { graduates: 5000, courses: 50, placement: 95 };
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounterValues({
        graduates: Math.floor(eased * targets.graduates),
        courses: Math.floor(eased * targets.courses),
        placement: Math.floor(eased * targets.placement),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 500);

    return () => clearTimeout(timer);
  }, [statsVisible]);

  // ✅ Intersection Observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect(); // Stop observing after first trigger
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // ✅ Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      if (glow1Ref.current) {
        glow1Ref.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
      if (glow2Ref.current) {
        glow2Ref.current.style.transform = `translateY(-${scrolled * 0.3}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // ✅ Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-24 md:py-32">
      
      {/* Parallax Glows */}
      <div
        ref={glow1Ref}
        className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-primary-400/30 blur-[120px] rounded-full pointer-events-none"
      />
      <div
        ref={glow2Ref}
        className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] bg-accent-500/30 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Orbit Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orbit-particle" style={{ top: "20%", left: "10%" }} />
        <div className="orbit-particle" style={{ top: "60%", right: "15%" }} />
        <div className="orbit-particle" style={{ bottom: "20%", left: "20%" }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* ============ LEFT CONTENT ============ */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6 border border-white/20">
              🚀 Admissions Now Open
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Launch Your
              <span className="block bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent">
                Tech Career Today
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-primary-100 max-w-xl leading-relaxed mb-10">
              Master in-demand tech skills with hands-on training, mentorship,
              and real-world projects designed to launch your career.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="group flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
              >
                Explore Courses
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <FaPlay size={12} />
                Watch Overview
              </button>
            </div>

            {/* Stats Counter */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 mt-14 max-w-md"
            >
              {[
                {
                  value: `${counterValues.graduates.toLocaleString()}+`,
                  label: "Graduates",
                },
                { value: `${counterValues.courses}+`, label: "Courses" },
                { value: `${counterValues.placement}%`, label: "Job Placement" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/10 text-center"
                >
                  <p className="text-2xl md:text-3xl font-bold">{value}</p>
                  <p className="text-sm text-primary-200">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ============ RIGHT CONTENT - VIDEO CARD ============ */}
          <div className="hidden lg:block">
            <div className="relative">
              
              {/* Glass Card */}
              <div
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group"
                onClick={() => setIsModalOpen(true)}
                role="button"
                aria-label="Open academy tour video"
              >
                {/* Video Preview Container */}
                <div className="relative rounded-2xl h-[320px] overflow-hidden bg-primary-900/50">
                  
                  {/*
                   * ✅ FIX: Replace with a real video file or use a thumbnail image
                   * Option A: Use actual video file placed in /public/videos/
                   * Option B: Use YouTube thumbnail as fallback (shown below)
                   */}

                  {/* Option B - YouTube Thumbnail as placeholder */}
                  <img
                    src="https://img.youtube.com/vi/tAaI_HX3G0E/maxresdefault.jpg"
                    alt="Academy Tour Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if YouTube thumbnail fails
                      e.target.style.display = "none";
                    }}
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div
                      className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full 
                                 flex items-center justify-center mb-4 shadow-xl 
                                 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                    >
                      <FaPlay className="text-white ml-1" size={24} />
                    </div>
                    <p className="text-white font-semibold text-lg">
                      Play Academy Tour (2:30)
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-accent-500/90 px-6 py-3 rounded-xl shadow-xl text-sm font-semibold animate-bounce">
                ✅ Next Cohort Starts Soon
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ VIDEO MODAL ============ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Academy Tour Video"
        >
          {/* ✅ Backdrop - click to close */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl z-10">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-14 right-0 bg-white/20 hover:bg-white/30 
                         text-white w-12 h-12 rounded-full flex items-center 
                         justify-center shadow-2xl hover:scale-110 transition-all"
              aria-label="Close video modal"
            >
              <FaTimes size={18} />
            </button>

            {/* YouTube Iframe */}
            <iframe
              className="w-full h-[56.25vw] max-h-[80vh] rounded-2xl shadow-2xl border-0"
              src="https://www.youtube.com/embed/tAaI_HX3G0E?autoplay=1&rel=0&modestbranding=1&playsinline=1"
              title="Presloaded Academy Overview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;