// src/pages/CourseDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCourseBySlug } from "../services/courseService";
import {
  enrollInCourse,
  getEnrollment,
} from "../services/enrollmentService";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import {
  formatPrice,
  formatDate,
  getDiscountPercent,
} from "../../utils/helpers";
import Loader from "../components/common/Loader";
import {
  FaClock,
  FaUsers,
  FaMapMarkerAlt,
  FaGlobe,
  FaCalendarAlt,
  FaCheckCircle,
  FaShoppingCart,
  FaArrowLeft,
  FaPlay,
  FaLock,
  FaBookOpen,
  FaCertificate,
  FaVideo,
} from "react-icons/fa";

const CourseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // Load course
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCourseBySlug(slug);
        setCourse(data.course);

        // If user is logged in, check enrollment status for online courses
        if (data.course.courseType === "online" && user) {
          try {
            const { data: enrollData } = await getEnrollment(data.course._id);
            setEnrollment(enrollData.enrollment);
          } catch {
            // Not enrolled — that's fine
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, user]);

  // ===== Handlers =====
  const handleEnrollFree = async () => {
    if (!user) {
      toast.error("Please login to enroll");
      navigate("/login");
      return;
    }

    if (!user.isEmailVerified) {
      toast.error("Please verify your email first");
      navigate("/dashboard?tab=profile");
      return;
    }

    setEnrolling(true);
    try {
      await enrollInCourse(course._id);
      toast.success("Enrolled successfully! Redirecting to course...");
      setTimeout(() => {
        navigate(`/learn/${course.slug}`);
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to purchase");
      navigate("/login");
      return;
    }
    addToCart(course);
    toast.success("Added to cart");
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // ===== Loading & Empty =====
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

  // ===== Computed =====
  const isOffline = course.courseType === "offline";
  const isOnline = course.courseType === "online";
  const isFree = course.isFree || course.price === 0;
  const discount = getDiscountPercent(course.price, course.discountPrice);
  const inCart = isInCart(course._id);
  const isEnrolled = !!enrollment;

  // Total lessons across all sections (for online)
  const totalLessons = course.totalLessons || 0;
  const totalDuration = course.totalDuration || 0;
  const formatDuration = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
        <div className="container-custom">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-6 text-sm"
          >
            <FaArrowLeft /> Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isOffline
                      ? "bg-green-500/20 text-green-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {isOffline ? "Offline Course" : "Online Course"}
                </span>
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                  {course.category}
                </span>
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full capitalize">
                  {course.level}
                </span>
                {isFree && isOnline && (
                  <span className="text-xs bg-yellow-500/30 text-yellow-200 px-3 py-1 rounded-full font-bold">
                    FREE
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-primary-100 text-lg leading-relaxed mb-6">
                {course.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-primary-200">
                {isOnline && totalLessons > 0 && (
                  <span className="flex items-center gap-1">
                    <FaVideo /> {totalLessons} lessons
                  </span>
                )}
                {isOnline && totalDuration > 0 && (
                  <span className="flex items-center gap-1">
                    <FaClock /> {formatDuration(totalDuration)}
                  </span>
                )}
                {isOffline && course.duration && (
                  <span className="flex items-center gap-1">
                    <FaClock /> {course.duration}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FaUsers /> {course.studentsEnrolled || 0} enrolled
                </span>
                {isOffline && course.startDate && (
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt /> Starts {formatDate(course.startDate)}
                  </span>
                )}
                {isOffline && course.location && (
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt /> {course.location}
                  </span>
                )}
                {isOnline && (
                  <span className="flex items-center gap-1">
                    <FaGlobe /> Self-paced
                  </span>
                )}
                {course.hasCertificate && (
                  <span className="flex items-center gap-1 text-yellow-300">
                    <FaCertificate /> Certificate
                  </span>
                )}
              </div>
            </div>

            {/* ===== STICKY ACTION CARD ===== */}
            <div className="bg-white text-gray-800 rounded-xl p-6 shadow-xl self-start">
              <img
                src={
                  course.thumbnail ||
                  "https://placehold.co/400x220/4f46e5/white?text=Course"
                }
                alt={course.title}
                className="w-full h-44 object-cover rounded-lg mb-4"
              />

              {/* Price */}
              {!isFree ? (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-primary-600">
                    {formatPrice(course.discountPrice || course.price)}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-gray-400 line-through">
                        {formatPrice(course.price)}
                      </span>
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div className="mb-4">
                  <span className="text-3xl font-bold text-green-600">Free</span>
                </div>
              )}

              {/* ===== ACTION BUTTONS ===== */}
              {isOnline ? (
                /* ONLINE COURSE */
                isEnrolled ? (
                  /* ✅ Already enrolled — Continue Learning */
                  <>
                    <Link
                      to={`/learn/${course.slug}`}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      <FaPlay size={13} />
                      {enrollment.completionPercentage > 0
                        ? "Continue Learning"
                        : "Start Learning"}
                    </Link>

                    {enrollment.completionPercentage > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Your progress</span>
                          <span className="font-medium text-primary-600">
                            {enrollment.completionPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{
                              width: `${enrollment.completionPercentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {enrollment.isCompleted &&
                      enrollment.certificate?.certificateNumber && (
                        <Link
                          to={`/certificate/${enrollment.certificate.certificateNumber}`}
                          className="mt-3 w-full flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 border border-yellow-200 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition"
                        >
                          🎓 View Certificate
                        </Link>
                      )}
                  </>
                ) : isFree ? (
                  /* ✅ Free online course — enroll directly */
                  <button
                    onClick={handleEnrollFree}
                    disabled={enrolling}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
                  >
                    <FaBookOpen size={13} />
                    {enrolling ? "Enrolling..." : "Enroll for Free"}
                  </button>
                ) : (
                  /* ✅ Paid online course — Add to cart */
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={inCart}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                        inCart
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-primary-600 text-white hover:bg-primary-700"
                      }`}
                    >
                      <FaShoppingCart size={13} />
                      {inCart ? "Already in Cart" : "Add to Cart"}
                    </button>

                    {inCart && (
                      <Link
                        to="/cart"
                        className="block text-center text-primary-600 text-sm mt-2 hover:underline"
                      >
                        Go to Cart →
                      </Link>
                    )}
                  </>
                )
              ) : (
                /* OFFLINE COURSE — always Add to Cart */
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={inCart}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                      inCart
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                    }`}
                  >
                    <FaShoppingCart size={13} />
                    {inCart ? "Already in Cart" : "Add to Cart"}
                  </button>

                  {inCart && (
                    <Link
                      to="/cart"
                      className="block text-center text-primary-600 text-sm mt-2 hover:underline"
                    >
                      Go to Cart →
                    </Link>
                  )}
                </>
              )}

              {/* Course meta */}
              <div className="mt-5 pt-5 border-t space-y-2 text-sm text-gray-600">
                {isOffline && course.schedule && (
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>{course.schedule}</span>
                  </div>
                )}
                {course.language && (
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-gray-400" />
                    <span>Language: {course.language}</span>
                  </div>
                )}
                {course.hasCertificate && (
                  <div className="flex items-center gap-2">
                    <FaCertificate className="text-gray-400" />
                    <span>Certificate of completion</span>
                  </div>
                )}
                {isOnline && (
                  <div className="flex items-center gap-2">
                    <FaPlay className="text-gray-400" />
                    <span>Lifetime access</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
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
                  <h2 className="text-2xl font-bold mb-4">
                    What You Will Learn
                  </h2>
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

              {/* ===== ONLINE CURRICULUM (Sections + Lessons) ===== */}
              {isOnline && course.sections?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Course Content</h2>
                    <p className="text-sm text-gray-500">
                      {course.totalSections} sections • {totalLessons} lessons
                      {totalDuration > 0 && ` • ${formatDuration(totalDuration)}`}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {course.sections.map((section, sIdx) => (
                      <div
                        key={section._id || sIdx}
                        className="border rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleSection(section._id || sIdx)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                        >
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Section {sIdx + 1}: {section.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {section.lessons?.length || 0} lessons
                            </p>
                          </div>
                          <span className="text-gray-400">
                            {expandedSections[section._id || sIdx] ? "−" : "+"}
                          </span>
                        </button>

                        {expandedSections[section._id || sIdx] && (
                          <div className="border-t divide-y">
                            {section.lessons?.map((lesson, lIdx) => (
                              <div
                                key={lesson._id || lIdx}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50"
                              >
                                {lesson.isFree || isEnrolled ? (
                                  <FaPlay
                                    size={11}
                                    className="text-primary-500 flex-shrink-0"
                                  />
                                ) : (
                                  <FaLock
                                    size={11}
                                    className="text-gray-300 flex-shrink-0"
                                  />
                                )}
                                <span className="flex-1 text-sm text-gray-700">
                                  {lesson.title}
                                </span>
                                {lesson.isFree && !isEnrolled && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    Preview
                                  </span>
                                )}
                                {lesson.videoDuration > 0 && (
                                  <span className="text-xs text-gray-400">
                                    {Math.floor(lesson.videoDuration / 60)}:
                                    {(lesson.videoDuration % 60)
                                      .toString()
                                      .padStart(2, "0")}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!isEnrolled && (
                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                      🔒 Enroll to unlock all lessons. Free preview lessons are
                      available without enrollment.
                    </div>
                  )}
                </div>
              )}

              {/* ===== OFFLINE CURRICULUM (Modules) ===== */}
              {isOffline && course.curriculum?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Curriculum</h2>
                  <div className="space-y-3">
                    {course.curriculum.map((mod, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Module {i + 1}: {mod.title}
                        </h3>
                        {mod.lessons?.length > 0 && (
                          <ul className="space-y-1.5 mt-3">
                            {mod.lessons.map((lesson, j) => (
                              <li
                                key={j}
                                className="text-sm text-gray-600 flex items-center justify-between gap-2"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full flex-shrink-0" />
                                  {lesson.title}
                                </span>
                                {lesson.duration && (
                                  <span className="text-xs text-gray-400">
                                    {lesson.duration}
                                  </span>
                                )}
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
                      <li
                        key={i}
                        className="text-gray-600 text-sm flex items-start gap-2"
                      >
                        <span className="text-primary-600 mt-1">•</span>
                        {req}
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
                        {typeof course.instructor === "string"
                          ? course.instructor.charAt(0).toUpperCase()
                          : course.instructor.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {typeof course.instructor === "string"
                          ? course.instructor
                          : course.instructor.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {typeof course.instructor === "object" &&
                          (course.instructor.title || "Instructor")}
                      </p>
                    </div>
                  </div>
                  {typeof course.instructor === "object" &&
                    course.instructor.bio && (
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