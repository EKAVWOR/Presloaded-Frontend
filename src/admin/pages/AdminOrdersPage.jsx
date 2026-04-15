import { useState, useEffect } from "react";
import { getAllOrdersAdmin } from "../../services/adminService";
import OrdersTable from "../components/OrdersTable";
import Loader from "../../components/common/Loader";
import { formatPrice } from "../../../utils/helpers";
import { FaMoneyBillWave, FaShoppingCart, FaClock } from "react-icons/fa";
import StatCard from "../components/StatCard";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const params = {};
        if (statusFilter) params.status = statusFilter;

        const { data } = await getAllOrdersAdmin(params);
        setOrders(data.orders || []);
        setStats(data.stats || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [statusFilter]);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-500 text-sm">Manage all course purchases</p>
      </div>

      {stats && (
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={<FaMoneyBillWave size={20} />}
            label="Total Revenue"
            value={formatPrice(stats.totalRevenue)}
            color="green"
          />
          <StatCard
            icon={<FaShoppingCart size={20} />}
            label="Completed Orders"
            value={stats.completedOrders}
            color="blue"
          />
          <StatCard
            icon={<FaClock size={20} />}
            label="Total Orders"
            value={stats.totalOrders}
            color="primary"
          />
        </div>
      )}

      {/* Filter */}
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-48"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
};

export default AdminOrdersPage;