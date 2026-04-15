import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../services/adminService";
import StatCard from "../components/StatCard";
import OrdersTable from "../components/OrdersTable";
import Loader from "../../components/common/Loader";
import { formatPrice } from "@utils/helpers";
import {
  FaUsers,
  FaBookOpen,
  FaShoppingCart,
  FaMoneyBillWave,
  FaEnvelope,
  FaNewspaper,
  FaDesktop,
  FaMapMarkerAlt,
} from "react-icons/fa";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;
  if (!stats) return <p className="text-red-500">Failed to load stats</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of your academy</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<FaMoneyBillWave size={24} />}
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          color="green"
        />
        <StatCard
          icon={<FaShoppingCart size={24} />}
          label="Total Orders"
          value={stats.completedOrders}
          color="blue"
          sub={`${stats.pendingOrders} pending`}
        />
        <StatCard
          icon={<FaUsers size={24} />}
          label="Total Students"
          value={stats.totalUsers}
          color="purple"
        />
        <StatCard
          icon={<FaBookOpen size={24} />}
          label="Total Courses"
          value={stats.totalCourses}
          color="primary"
          sub={`${stats.publishedCourses} published`}
        />
        <StatCard
          icon={<FaMapMarkerAlt size={24} />}
          label="Offline Courses"
          value={stats.offlineCourses}
          color="green"
        />
        <StatCard
          icon={<FaDesktop size={24} />}
          label="Online Courses"
          value={stats.onlineCourses}
          color="blue"
        />
        <StatCard
          icon={<FaEnvelope size={24} />}
          label="Unread Messages"
          value={stats.unreadMessages}
          color="red"
        />
        <StatCard
          icon={<FaNewspaper size={24} />}
          label="Subscribers"
          value={stats.totalSubscribers}
          color="yellow"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-primary-600 text-sm hover:underline"
            >
              View All
            </Link>
          </div>
          {stats.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {order.user?.name || "—"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.courses?.map((c) => c.title).join(", ")}
                    </p>
                  </div>
                  <p className="font-semibold text-green-600 text-sm">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent orders</p>
          )}
        </div>

        {/* Popular Courses */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Popular Courses</h2>
            <Link
              to="/admin/courses"
              className="text-primary-600 text-sm hover:underline"
            >
              View All
            </Link>
          </div>
          {stats.popularCourses?.length > 0 ? (
            <div className="space-y-3">
              {stats.popularCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center gap-3 border-b pb-3 last:border-0"
                >
                  <img
                    src={
                      course.thumbnail ||
                      "https://placehold.co/60x40/4f46e5/white?text=C"
                    }
                    alt=""
                    className="w-14 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {course.studentsEnrolled} enrolled •{" "}
                      {course.courseType}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-primary-600">
                    {formatPrice(course.price)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No courses yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
