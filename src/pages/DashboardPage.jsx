import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getMyOrders, downloadAdmissionLetter } from "../services/orderService";
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
} from "react-icons/fa";

const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "courses";
  const [tab, setTab] = useState(initialTab);
  const { user, loadUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile form
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || "", phone: user.phone || "" });
    }
  }, [user]);

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
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
      link.setAttribute("download", `Admission_Letter_${courseTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download admission letter");
    }
  };

  const completedOrders = orders.filter((o) => o.paymentStatus === "completed");

  const tabs = [
    { key: "courses", label: "My Courses", icon: <FaBookOpen /> },
    { key: "profile", label: "Profile", icon: <FaUser /> },
  ];

  return (
    <>
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-bold">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-primary-200 mt-1">Manage your courses and profile</p>
        </div>
      </section>

      {/* Email verification banner */}
      {user && !user.isEmailVerified && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container-custom py-3 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm text-yellow-800">
              <FaExclamationTriangle /> Your email is not verified. Please verify to purchase courses.
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

      <section className="section-padding">
        <div className="container-custom">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-8">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition ${
                  tab === t.key
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* My Courses Tab */}
          {tab === "courses" && (
            <div>
              {loadingOrders ? (
                <Loader />
              ) : completedOrders.length === 0 ? (
                <div className="text-center py-16">
                  <FaBookOpen size={50} className="text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-700 mb-2">No courses yet</h2>
                  <p className="text-gray-500 mb-4">
                    You haven&apos;t enrolled in any offline courses yet.
                  </p>
                  <a href="/courses" className="btn-primary">Browse Courses</a>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedOrders.map((order) =>
                    order.courses.map((c, idx) => (
                      <div
                        key={`${order._id}-${idx}`}
                        className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{c.title}</h3>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                            <span>Paid: {formatPrice(c.price)}</span>
                            <span>Date: {formatDate(order.createdAt)}</span>
                            <span className="flex items-center gap-1 text-green-600">
                              <FaCheckCircle /> Confirmed
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleDownloadLetter(order._id, c.courseId, c.title)
                          }
                          className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 transition"
                        >
                          <FaDownload /> Admission Letter
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {tab === "profile" && (
            <div className="max-w-2xl space-y-8">
              {/* Update Profile */}
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-lg font-bold mb-4">Update Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="input-field bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>

              {/* Change Password */}
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-lg font-bold mb-4">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, currentPassword: e.target.value })
                      }
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, newPassword: e.target.value })
                      }
                      required
                      minLength={6}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirmPassword: e.target.value })
                      }
                      required
                      className="input-field"
                    />
                  </div>
                  <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;