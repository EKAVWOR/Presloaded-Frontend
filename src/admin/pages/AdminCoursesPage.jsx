// src/admin/pages/AdminCoursesPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllCoursesAdmin,
  deleteCourse,
} from "../../services/adminService";
import { formatPrice } from "../../../utils/helpers";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaVideo,
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
      toast.error("Failed to load courses");
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <p className="text-gray-500 text-sm">
            {courses.length} total course{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/admin/courses/new"
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Course
        </Link>
      </div>

      {/* Empty State */}
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
              <tr className="bg-gray-50 text-left text-gray-600 border-b">
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
                  {/* Course Info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          course.thumbnail ||
                          "https://placehold.co/60x40/4f46e5/white?text=C"
                        }
                        alt={course.title}
                        className="w-14 h-10 object-cover rounded flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[180px]">
                          {course.title}
                        </p>
                        {course.instructor && (
                          <p className="text-xs text-gray-400 truncate">
                            {course.instructor}
                          </p>
                        )}
                        {/* ✅ Curriculum link — INSIDE the map loop */}
                        {course.courseType === "online" && (
                          <Link
                            to={`/admin/courses/${course._id}/curriculum`}
                            className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 mt-0.5"
                          >
                            <FaVideo size={10} /> Curriculum
                            {course.totalLessons > 0 && (
                              <span className="text-gray-400">
                                ({course.totalLessons} lessons)
                              </span>
                            )}
                          </Link>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                        course.courseType === "offline"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {course.courseType}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {course.category}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 font-semibold">
                    {course.isFree ? (
                      <span className="text-green-600 text-xs font-medium">
                        Free
                      </span>
                    ) : (
                      formatPrice(course.discountPrice || course.price)
                    )}
                  </td>

                  {/* Enrolled */}
                  <td className="px-4 py-3 text-gray-600">
                    {course.studentsEnrolled || 0}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {course.isPublished ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <FaEye size={11} /> Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <FaEyeSlash size={11} /> Draft
                        </span>
                      )}
                      {course.isFeatured && (
                        <FaStar
                          className="text-yellow-500"
                          title="Featured"
                          size={11}
                        />
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {/* Edit */}
                      <Link
                        to={`/admin/courses/edit/${course._id}`}
                        className="text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition"
                        title="Edit course"
                      >
                        <FaEdit size={13} />
                      </Link>

                      {/* Curriculum (online only) */}
                      {course.courseType === "online" && (
                        <Link
                          to={`/admin/courses/${course._id}/curriculum`}
                          className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition"
                          title="Manage curriculum"
                        >
                          <FaVideo size={13} />
                        </Link>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() =>
                          handleDelete(course._id, course.title)
                        }
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                        title="Delete course"
                      >
                        <FaTrash size={13} />
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