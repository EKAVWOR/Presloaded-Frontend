const testimonials = [
  {
    name: "Adebayo Johnson",
    role: "Full Stack Developer",
    text: "Tech Academy transformed my career. I went from zero coding knowledge to landing a developer role in just 6 months.",
    avatar: "AJ",
  },
  {
    name: "Chioma Okafor",
    role: "Data Analyst",
    text: "The hands-on training approach made all the difference. The instructors are incredibly supportive and knowledgeable.",
    avatar: "CO",
  },
  {
    name: "Emeka Nwosu",
    role: "Mobile Developer",
    text: "Best investment I ever made. The curriculum is up-to-date and the career support is outstanding.",
    avatar: "EN",
  },
];

const Testimonials = () => (
  <section className="section-padding">
    <div className="container-custom">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What Our Students Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hear from graduates who have transformed their careers.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">{t.avatar}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed italic">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex gap-1 mt-4 text-yellow-400">
              {[...Array(5)].map((_, j) => (
                <span key={j}>★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;