// src/pages/DashboardPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getMyOrders, downloadAdmissionLetter } from "../services/orderService";
import { getMyEnrollments } from "../services/enrollmentService";
import {
  resendVerification,
  updateProfile,
  changePassword,
} from "../services/authService";
import { formatPrice, formatDate } from "../../utils/helpers";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import {
  FaBookOpen,
  FaUser,
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaPlay,
  FaTrophy,
  FaCertificate,
  FaLock,
  FaGraduationCap,
} from "react-icons/fa";

const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "offline";
  const [tab, setTab] = useState(initialTab);
  const { user, loadUser } = useAuth();

  // Offline orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Online enrollments
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  // Profile form
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  // ===== Load offline orders =====
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    loadOrders();
  }, []);

  // ===== Load online enrollments =====
  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        const { data } = await getMyEnrollments();
        setEnrollments(data.enrollments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEnrollments(false);
      }
    };
    loadEnrollments();
  }, []);

  // ===== Sync profile form with user =====
  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || "", phone: user.phone || "" });
    }
  }, [user]);

  // ===== Handlers =====
  const handleResendVerification = async () => {
    try {
      await resendVerification();
      toast.success("Verification email sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
      await loadUser();
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setSaving(true);
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadLetter = async (orderId, courseId, courseTitle) => {
    try {
      const response = await downloadAdmissionLetter(orderId, courseId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Admission_Letter_${courseTitle.replace(/\s+/g, "_")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download admission letter");
    }
  };

  // ===== Computed =====
  const completedOrders = orders.filter(
    (o) => o.paymentStatus === "completed"
  );

  const completedEnrollments = enrollments.filter((e) => e.isCompleted).length;
  const inProgressEnrollments = enrollments.filter(
    (e) => !e.isCompleted && e.completionPercentage > 0
  ).length;

  const tabs = [
    {
      key: "offline",
      label: "Offline Courses",
      icon: <FaBookOpen />,
      count: completedOrders.length,
    },
    {
      key: "online",
      label: "Online Courses",
      icon: <FaPlay />,
      count: enrollments.length,
    },
    {
      key: "profile",
      label: "Profile",
      icon: <FaUser />,
    },
  ];

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-primary-200 mt-1">
            Manage your courses and profile
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              {
                label: "Offline Enrolled",
                value: completedOrders.length,
                icon: <FaBookOpen />,
              },
              {
                label: "Online Enrolled",
                value: enrollments.length,
                icon: <FaPlay />,
              },
              {
                label: "Completed",
                value: completedEnrollments,
                icon: <FaTrophy />,
              },
              {
                label: "Certificates",
                value: enrollments.filter((e) => e.certificateIssued).length,
                icon: <FaCertificate />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-primary-200 mt-1 flex items-center justify-center gap-1">
                  {stat.icon} {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Email Verification Banner ===== */}
      {user && !user.isEmailVerified && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container-custom py-3 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm text-yellow-800">
              <FaExclamationTriangle />
              Your email is not verified. Please verify to purchase courses.
            </p>
            <button
              onClick={handleResendVerification}
              className="flex items-center gap-1 text-sm font-medium text-yellow-800 hover:underline"
            >
              <FaEnvelope /> Resend verification email
            </button>
          </div>
        </div>
      )}

      {/* ===== Main Content ===== */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                  tab === t.key
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {t.icon}
                {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      tab === t.key
                        ? "bg-primary-100 text-primary-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ============================= */}
          {/* OFFLINE COURSES TAB           */}
          {/* ============================= */}
          {tab === "offline" && (
            <div>
              {loadingOrders ? (
                <Loader />
              ) : completedOrders.length === 0 ? (
                <div className="text-center py-16">
                  <FaBookOpen
                    size={50}
                    className="text-gray-300 mx-auto mb-4"
                  />
                  <h2 className="text-xl font-bold text-gray-700 mb-2">
                    No offline courses yet
                  </h2>
                  <p className="text-gray-500 mb-4">
                    You haven&apos;t enrolled in any offline courses yet.
                  </p>
                  <Link
                    to="/courses?courseType=offline"
                    className="btn-primary"
                  >
                    Browse Offline Courses
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedOrders.map((order) =>
                    order.courses.map((c, idx) => (
                      <div
                        key={`${order._id}-${idx}`}
                        className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          {/* Icon */}
                          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                            <FaGraduationCap size={20} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">
                              {c.title}
                            </h3>
                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                              <span>Paid: {formatPrice(c.price)}</span>
                              <span>•</span>
                              <span>Date: {formatDate(order.createdAt)}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-green-600">
                                <FaCheckCircle size={12} /> Confirmed
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              Ref: {order.paystackReference}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleDownloadLetter(
                              order._id,
                              c.courseId,
                              c.title
                            )
                          }
                          className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 transition whitespace-nowrap"
                        >
                          <FaDownload size={12} /> Admission Letter
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================= */}
          {/* ONLINE COURSES TAB            */}
          {/* ============================= */}
          {tab === "online" && (
            <div>
              {loadingEnrollments ? (
                <Loader />
              ) : enrollments.length === 0 ? (
                <div className="text-center py-16">
                  <FaPlay size={50} className="text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-700 mb-2">
                    No online courses yet
                  </h2>
                  <p className="text-gray-500 mb-4">
                    Enroll in an online course to start learning.
                  </p>
                  <Link
                    to="/courses?courseType=online"
                    className="btn-primary"
                  >
                    Browse Online Courses
                  </Link>
                </div>
              ) : (
                <>
                  {/* Summary */}
                  {enrollments.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-6">
                      {inProgressEnrollments > 0 && (
                        <span className="text-sm bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full">
                          🔵 {inProgressEnrollments} In Progress
                        </span>
                      )}
                      {completedEnrollments > 0 && (
                        <span className="text-sm bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full">
                          ✅ {completedEnrollments} Completed
                        </span>
                      )}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-5">
                    {enrollments.map((enrollment) => (
                      <div
                        key={enrollment._id}
                        className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition"
                      >
                        {/* Thumbnail */}
                        {enrollment.course?.thumbnail ? (
                          <img
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            className="w-full h-40 object-cover"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                            <FaPlay size={32} className="text-primary-400" />
                          </div>
                        )}

                        <div className="p-5">
                          {/* Title & level */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-gray-800 leading-tight line-clamp-2">
                              {enrollment.course?.title}
                            </h3>
                            {enrollment.isCompleted && (
                              <span className="flex-shrink-0 flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                <FaTrophy size={10} /> Done
                              </span>
                            )}
                          </div>

                          {enrollment.course?.instructor && (
                            <p className="text-xs text-gray-500 mb-3">
                              By {enrollment.course.instructor}
                            </p>
                          )}

                          {/* Progress bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>
                                {enrollment.course?.totalLessons
                                  ? `${Math.round(
                                      (enrollment.completionPercentage / 100) *
                                        enrollment.course.totalLessons
                                    )} / ${enrollment.course.totalLessons} lessons`
                                  : "Progress"}
                              </span>
                              <span className="font-medium text-primary-600">
                                {enrollment.completionPercentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  enrollment.isCompleted
                                    ? "bg-green-500"
                                    : "bg-primary-600"
                                }`}
                                style={{
                                  width: `${enrollment.completionPercentage}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Last accessed */}
                          {enrollment.lastAccessedAt && (
                            <p className="text-xs text-gray-400 mb-4">
                              Last accessed:{" "}
                              {formatDate(enrollment.lastAccessedAt)}
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Certificate */}
                            {enrollment.isCompleted &&
                              enrollment.certificate?.certificateNumber && (
                                <Link
                                  to={`/certificate/${enrollment.certificate.certificateNumber}`}
                                  className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition"
                                >
                                  🎓 Certificate
                                </Link>
                              )}

                            {/* Continue / Start */}
                            <Link
                              to={`/learn/${enrollment.course?.slug}`}
                              className="flex items-center gap-2 btn-primary text-sm py-2 px-4 ml-auto"
                            >
                              <FaPlay size={11} />
                              {enrollment.isCompleted
                                ? "Review"
                                : enrollment.completionPercentage > 0
                                ? "Continue"
                                : "Start Learning"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ============================= */}
          {/* PROFILE TAB                   */}
          {/* ============================= */}
          {tab === "profile" && (
            <div className="max-w-2xl space-y-8">
              {/* Account Overview */}
              <div className="bg-white border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {user?.name}
                    </h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {user?.isEmailVerified ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <FaCheckCircle size={11} /> Email verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-yellow-600">
                          <FaExclamationTriangle size={11} /> Email not verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Profile */}
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-lg font-bold mb-4">Update Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="input-field bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="input-field"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>

              {/* Change Password */}
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FaLock size={16} className="text-gray-400" />
                  Change Password
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                      required
                      minLength={6}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      className="input-field"
                    />
                    {passwords.confirmPassword &&
                      passwords.newPassword !== passwords.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>

              {/* Email Verification */}
              {!user?.isEmailVerified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h2 className="text-lg font-bold mb-2 text-yellow-800">
                    Verify Your Email
                  </h2>
                  <p className="text-sm text-yellow-700 mb-4">
                    Your email address is not verified. Verify it to unlock
                    course purchases.
                  </p>
                  <button
                    onClick={handleResendVerification}
                    className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition"
                  >
                    <FaEnvelope /> Resend Verification Email
                  </button>
                </div>
              )}

              {/* Danger Zone */}
              <div className="bg-white border border-red-100 rounded-xl p-6">
                <h2 className="text-lg font-bold mb-2 text-red-600">
                  Account Info
                </h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Member since</span>
                    <span className="font-medium">
                      {formatDate(user?.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account type</span>
                    <span className="font-medium capitalize">
                      {user?.role || "student"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Courses purchased</span>
                    <span className="font-medium">
                      {user?.purchasedCourses?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;