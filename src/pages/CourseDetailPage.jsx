import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseBySlug } from "../services/courseService";
import { useCart } from "../hooks/useCart";
import { formatPrice, formatDate, getDiscountPercent } from "../../utils/helpers";
import { ELEARNING_URL } from "../../utils/constants";
import Loader from "../components/common/Loader";
import {
  FaClock,
  FaUsers,
  FaMapMarkerAlt,
  FaGlobe,
  FaCalendarAlt,
  FaCheckCircle,
  FaShoppingCart,
  FaExternalLinkAlt,
  FaArrowLeft,
} from "react-icons/fa";

const CourseDetailPage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCourseBySlug(slug);
        setCourse(data.course);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <Loader fullScreen />;
  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <Link to="/courses" className="text-primary-600 hover:underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  const isOffline = course.courseType === "offline";
  const discount = getDiscountPercent(course.price, course.discountPrice);
  const inCart = isInCart(course._id);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <div className="container-custom">
          <Link to="/courses" className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-6 text-sm">
            <FaArrowLeft /> Back to Courses
          </Link>
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isOffline ? "bg-green-500/20 text-green-300" : "bg-blue-500/20 text-blue-300"}`}>
                  {isOffline ? "Offline Course" : "Online Course"}
                </span>
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full">{course.category}</span>
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full">{course.level}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-primary-100 text-lg leading-relaxed mb-6">
                {course.shortDescription}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-primary-200">
                <span className="flex items-center gap-1"><FaClock /> {course.duration}</span>
                <span className="flex items-center gap-1"><FaUsers /> {course.studentsEnrolled || 0} enrolled</span>
                {isOffline && course.startDate && (
                  <span className="flex items-center gap-1"><FaCalendarAlt /> Starts {formatDate(course.startDate)}</span>
                )}
                {isOffline && course.location && (
                  <span className="flex items-center gap-1"><FaMapMarkerAlt /> {course.location}</span>
                )}
                {!isOffline && (
                  <span className="flex items-center gap-1"><FaGlobe /> E-Learning</span>
                )}
              </div>
            </div>

            {/* Sticky Card */}
            <div className="bg-white text-gray-800 rounded-xl p-6 shadow-xl self-start">
              <img
                src={course.thumbnail || "https://placehold.co/400x220/4f46e5/white?text=Course"}
                alt={course.title}
                className="w-full h-44 object-cover rounded-lg mb-4"
              />
              {isOffline ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-primary-600">
                      {formatPrice(course.discountPrice || course.price)}
                    </span>
                    {discount > 0 && (
                      <>
                        <span className="text-gray-400 line-through">{formatPrice(course.price)}</span>
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                          -{discount}%
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(course)}
                    disabled={inCart}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                      inCart
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                    }`}
                  >
                    <FaShoppingCart /> {inCart ? "Already in Cart" : "Add to Cart"}
                  </button>
                  {inCart && (
                    <Link to="/cart" className="block text-center text-primary-600 text-sm mt-2 hover:underline">
                      Go to Cart →
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4 text-sm">
                    This course is delivered on our e-learning platform.
                  </p>
                  <a
                    href={course.onlinePlatformUrl || ELEARNING_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Go to E-Learning <FaExternalLinkAlt size={14} />
                  </a>
                </>
              )}
              {course.schedule && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                  📅 Schedule: {course.schedule}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </div>

              {/* What You Will Learn */}
              {course.whatYouWillLearn?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">What You Will Learn</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum */}
              {course.curriculum?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Curriculum</h2>
                  <div className="space-y-3">
                    {course.curriculum.map((mod, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800">
                          Module {i + 1}: {mod.title}
                        </h3>
                        {mod.topics?.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {mod.topics.map((topic, j) => (
                              <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {course.requirements?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                        <span className="text-primary-600 mt-1">•</span> {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Instructor Sidebar */}
            <div>
              {course.instructor && (
                <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                  <h3 className="font-bold mb-4">Instructor</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-lg">
                        {course.instructor.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{course.instructor.name}</p>
                      <p className="text-sm text-gray-500">{course.instructor.title || "Instructor"}</p>
                    </div>
                  </div>
                  {course.instructor.bio && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {course.instructor.bio}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseDetailPage;