import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/adminService";
import { formatDate } from "../../../utils/helpers";
import Loader from "../../components/common/Loader";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const AdminStudentsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = { role: "student" };
        if (search) params.search = search;
        if (verifiedFilter) params.verified = verifiedFilter;

        const { data } = await getAllUsers(params);
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [search, verifiedFilter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        <p className="text-gray-500 text-sm">Manage registered students</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field !pl-10 w-64"
          />
        </div>
        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className="input-field w-48"
        >
          <option value="">All Students</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No students found</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Verified</th>
                <th className="px-4 py-3 font-medium">Courses</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {user.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {user.isEmailVerified ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-400" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.purchasedCourses?.length > 0 ? (
                      <div>
                        {user.purchasedCourses.map((c, i) => (
                          <p key={i} className="text-xs text-gray-600">
                            {c.title || c}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStudentsPage;