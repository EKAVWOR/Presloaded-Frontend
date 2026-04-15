import { Link } from "react-router-dom";

const CTA = () => (
  <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
    <div className="container-custom text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Ready to Start Your Tech Journey?
      </h2>
      <p className="text-primary-100 max-w-xl mx-auto mb-8 text-lg">
        Enrol today and take the first step toward a rewarding career in technology.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/courses"
          className="bg-white text-primary-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Browse Courses
        </Link>
        <Link
          to="/contact"
          className="border-2 border-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition"
        >
          Contact Us
        </Link>
      </div>
    </div>
  </section>
);

export default CTA;