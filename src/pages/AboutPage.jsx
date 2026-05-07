import { FaBullseye, FaEye, FaGem } from "react-icons/fa";
import CTA from "../components/home/CTA";
import img1 from "../../src/assets/img1.jpg";
import img2 from "../../src/assets/img2.jpg";
import img3 from "../../src/assets/img3.jpg";

const AboutPage = () => (
  <>
    {/* Header */}
    <section className="relative bg-gradient-to-r from-primary-800 to-primary-600 text-white py-20 overflow-hidden">
      <div className="container-custom text-center relative z-10 animate-in fade-in-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
          About Presloaded Academy
        </h1>
        <p className="text-primary-100 max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed animate-in fade-in-up duration-1000">
          Building Africa's next generation of tech leaders through hands-on training and real-world projects.
        </p>
      </div>
      {/* Header bg overlay */}
      <div className="absolute inset-0 bg-black/20" />
    </section>

    {/* Our Story - img1-3 integration */}
    <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20 animate-in slide-in-from-bottom">
          <div className="order-2 lg:order-1 animate-in slide-in-from-left delay-200">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed animate-in fade-in-up delay-200">
              Founded with a passion to bridge Africa's tech skills gap, Presloaded Academy has empowered thousands of students 
              through our unique blend of practical training, industry mentorship, and real-world projects.
            </p>
            <div className="grid md:grid-cols-2 gap-4 animate-in fade-in-up delay-400">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                <p className="text-sm font-medium text-gray-600">Programs Offered</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="text-3xl font-bold text-primary-600 mb-2">5,000+</div>
                <p className="text-sm font-medium text-gray-600">Happy Graduates</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative animate-in slide-in-from-right">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={img1} 
                alt="Academy Campus" 
                className="w-full h-64 object-cover rounded-2xl shadow-2xl hover:scale-105 transition-all duration-500 hover:shadow-3xl cursor-pointer animate-in zoom-in delay-200"
                loading="lazy"
              />
              <img 
                src={img2} 
                alt="Classroom Training" 
                className="w-full h-64 object-cover rounded-2xl shadow-2xl hover:scale-105 transition-all duration-500 hover:shadow-3xl cursor-pointer animate-in zoom-in delay-400"
                loading="lazy"
              />
            </div>
            <img 
              src={img3} 
              alt="Team Celebration" 
              className="w-full mt-[-20px] ml-[20px] h-48 lg:h-64 object-cover rounded-tl-2xl rounded-br-2xl shadow-2xl hover:scale-105 transition-all duration-500 hover:shadow-3xl cursor-pointer animate-in slide-in-from-bottom delay-600 z-10 relative"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Mission Vision Values */}
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <div className="text-center mb-20 animate-in fade-in-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 drop-shadow-sm">Our Promise</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">What drives us every day</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaBullseye size={48} className="text-primary-600" />,
              title: "Our Mission",
              desc: "Deliver accessible, world-class tech education that empowers individuals from all backgrounds to build thriving tech careers.",
              delay: "0",
            },
            {
              icon: <FaEye size={48} className="text-accent-500" />,
              title: "Our Vision", 
              desc: "Become Africa's premier technology academy, producing globally competitive professionals who lead innovation.",
              delay: "200",
            },
            {
              icon: <FaGem size={48} className="text-emerald-500" />,
              title: "Our Values",
              desc: "Excellence • Innovation • Integrity • Student Success – these guide every decision we make.",
              delay: "400",
            },
          ].map((item, i) => (
            <div 
              key={i} 
              className="group bg-white/70 backdrop-blur-sm rounded-2xl p-10 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 border border-white/50 hover:border-primary-200 animate-in fade-in-up"
              style={{ "--delay": `${item.delay}ms` }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-primary-700 transition">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <CTA />
  </>
);

export default AboutPage;
