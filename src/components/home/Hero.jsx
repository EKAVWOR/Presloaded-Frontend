import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaArrowRight } from "react-icons/fa";

const Hero = () => {
  const [statsVisible, setStatsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState({ graduates: 0, courses: 0, placement: 0 });
  const glow1Ref = useRef(null);
  const glow2Ref = useRef(null);
  const statsRef = useRef(null);

  const countUp = useCallback((target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
    }, 16);
    return Math.floor(start);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          setTimeout(() => {
            setCounterValues({
              graduates: 5000,
              courses: 50,
              placement: 95
            });
          }, 500);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      if (glow1Ref.current) glow1Ref.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      if (glow2Ref.current) glow2Ref.current.style.transform = `translateY(-${scrolled * 0.3}px)`;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = () => {
    const modal = document.getElementById("video-modal");
    if (modal) modal.classList.remove("hidden");
  };

  const closeModal = () => {
    const modal = document.getElementById("video-modal");
    if (modal) modal.classList.add("hidden");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-24 md:py-32">
      {/* Parallax Glows */}
      <div 
        ref={glow1Ref} 
        className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-primary-400/30 blur-[120px] rounded-full parallax-glow animate-float"
      />
      <div 
        ref={glow2Ref} 
        className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] bg-accent-500/30 blur-[120px] rounded-full parallax-glow animate-float"
      />

      {/* Orbit Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orbit-particle" style={{ top: '20%', left: '10%' }} />
        <div className="orbit-particle" style={{ top: '60%', right: '15%' }} />
        <div className="orbit-particle" style={{ bottom: '20%', left: '20%' }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center animate-in fade-in-0">
          {/* Left Content */}
          <div className="animate-in slide-in-from-left duration-1000 delay-200">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6 border border-white/20 hover:animate-bounce-slow">
              🚀 Admissions Now Open
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 animate-in slide-in-from-bottom duration-1000">
              Launch Your
              <span className="block typing-text bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent">
                Tech Career Today
              </span>
            </h1>

            <p className="text-lg text-primary-100 max-w-xl leading-relaxed mb-10 animate-in fade-in-up duration-1000 delay-400">
              Master in-demand tech skills with hands-on training, mentorship, and real-world projects designed to launch your career.
            </p>

            <div className="flex flex-wrap gap-4 animate-in fade-in-up duration-1000 delay-600">
              <Link
                to="/courses"
                className="group flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 hover:pulse-glow"
              >
                Explore Courses <FaArrowRight className="group-hover:animate-bounce-slow" />
              </Link>
              <button
                onClick={openModal}
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/30 hover:bg-white/10 transition-all duration-300 hover:animate-float hover:scale-105"
              >
                <FaPlay size={12} />
                Watch Overview
              </button>
            </div>

            <div ref={statsRef} className="grid grid-cols-3 gap-6 mt-14 max-w-md counter-stat">
              <div className={`bg-white/10 backdrop-blur p-4 rounded-xl border border-white/10 text-center animate-in fade-in-up duration-1000 delay-800 ${statsVisible ? 'animate-counter-up' : ''}`}>
                <p className="text-2xl md:text-3xl font-bold count" data-target="5000+">
                  {counterValues.graduates.toLocaleString()}+
                </p>
                <p className="text-sm text-primary-200">Graduates</p>
              </div>
              <div className={`bg-white/10 backdrop-blur p-4 rounded-xl border border-white/10 text-center animate-in fade-in-up duration-1000 delay-1000 ${statsVisible ? 'animate-counter-up' : ''}`}>
                <p className="text-2xl md:text-3xl font-bold count" data-target="50+">
                  {counterValues.courses}+
                </p>
                <p className="text-sm text-primary-200">Courses</p>
              </div>
              <div className={`bg-white/10 backdrop-blur p-4 rounded-xl border border-white/10 text-center animate-in fade-in-up duration-1000 delay-1200 ${statsVisible ? 'animate-counter-up' : ''}`}>
                <p className="text-2xl md:text-3xl font-bold count" data-target="95%">
                  {counterValues.placement}%
                </p>
                <p className="text-sm text-primary-200">Job Placement</p>
              </div>
            </div>
          </div>

         <div className="hidden lg:block animate-in slide-in-from-right duration-1000">
  <div className="relative">

    {/* Glass Card */}
    <div 
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group"
      onClick={openModal}
    >

      {/* Video Container */}
      <div className="relative rounded-2xl h-[320px] overflow-hidden">

        {/* Video */}
        <video
          src="/videos/academy-tour.mp4"
          poster="/images/video-thumbnail.jpg"
          className="w-full h-full object-cover"
          muted
          loop
          autoPlay
          playsInline
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />   

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 
                          shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <FaPlay className="text-white ml-1" size={24} />
          </div>

          <p className="text-white font-semibold text-lg group-hover:text-gray-200 transition">
            Play Academy Tour (2:30)
          </p>

        </div>

      </div>

    </div>

    {/* Floating Badge */}
    <div className="absolute -bottom-6 -left-6 bg-accent-500/90 px-6 py-3 rounded-xl shadow-xl text-sm font-semibold animate-bounce-slow">
      ✅ Next Cohort Starts Soon
    </div>

  </div>
</div>
        </div>
      </div>

      {/* Video Modal */}
      <div id="video-modal" className="fixed inset-0 z-[10000] hidden flex items-center justify-center p-4  not-even:">
        <div className="relative w-full max-w-4xl max-h-[90vh] mx-auto">
          <button 
            onClick={() => document.getElementById('video-modal')?.classList.add('hidden')}
            className="absolute top-4 right-4 z-10 bg-white/95 hover:bg-white text-primary-700 text-2xl w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all font-bold"
          >
            ×
          </button>
          <iframe
            className="w-full h-[70vh] lg:h-[80vh] rounded-3xl shadow-2xl border-0"
            src="https://www.youtube.com/embed/tAaI_HX3G0E?autoplay=1&rel=0&modestbranding=1&playsinline=1"
            title="Presloaded Academy Overview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
