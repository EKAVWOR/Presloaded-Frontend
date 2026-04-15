import { useState, useEffect } from "react";
import { getSubscribers } from "../../services/adminService";
import SubscribersTable from "../components/SubscribersTable";
import Loader from "../../components/common/Loader";

const AdminSubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getSubscribers();
        setSubscribers(data.subscribers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Newsletter Subscribers
        </h1>
        <p className="text-gray-500 text-sm">
          {subscribers.length} subscriber{subscribers.length !== 1 && "s"}
        </p>
      </div>

      <SubscribersTable subscribers={subscribers} />
    </div>
  );
};

export default AdminSubscribersPage;