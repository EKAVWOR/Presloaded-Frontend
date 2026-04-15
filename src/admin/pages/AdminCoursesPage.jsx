import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllCoursesAdmin,
  deleteCourse,
} from "../../services/adminService";
import { formatPrice, formatDate } from "../../../utils/helpers";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaStar,
} from "react-icons/fa";

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    try {
      const { data } = await getAllCoursesAdmin();
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success("Course deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <p className="text-gray-500 text-sm">
            {courses.length} total courses
          </p>
        </div>
        <Link
          to="/admin/courses/new"
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-500 mb-4">No courses yet</p>
          <Link to="/admin/courses/new" className="btn-primary">
            Create First Course
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Enrolled</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          course.thumbnail ||
                          "https://placehold.co/60x40/4f46e5/white?text=C"
                        }
                        alt=""
                        className="w-14 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium truncate max-w-[200px]">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {course.duration}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        course.courseType === "offline"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {course.courseType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {course.category}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {course.courseType === "offline"
                      ? formatPrice(course.discountPrice || course.price)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {course.studentsEnrolled}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {course.isPublished ? (
                        <FaEye className="text-green-500" title="Published" />
                      ) : (
                        <FaEyeSlash className="text-gray-400" title="Draft" />
                      )}
                      {course.isFeatured && (
                        <FaStar
                          className="text-yellow-500"
                          title="Featured"
                          size={12}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/courses/edit/${course._id}`}
                        className="text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(course._id, course.title)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
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

export default AdminCoursesPage;