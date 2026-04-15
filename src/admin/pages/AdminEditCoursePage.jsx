import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CourseForm from "../components/CourseForm";
import Loader from "../../components/common/Loader";
import API from "../../services/api";

const AdminEditCoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch course by ID from admin endpoint
        const { data } = await API.get(`/courses/admin/all`);
        const found = data.courses?.find((c) => c._id === id);
        setCourse(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader />;
  if (!course)
    return <p className="text-red-500 text-center py-10">Course not found</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Course</h1>
        <p className="text-gray-500 text-sm">{course.title}</p>
      </div>
      <CourseForm existingCourse={course} />
    </div>
  );
};

export default AdminEditCoursePage;