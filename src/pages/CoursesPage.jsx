import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCourses } from "../services/courseService";
import CourseCard from "../components/courses/CourseCard";
import CourseFilter from "../components/courses/CourseFilter";
import Loader from "../components/common/Loader";

const CoursesPage = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    courseType: "",
    category: searchParams.get("category") || "",
    level: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.courseType) params.courseType = filters.courseType;
        if (filters.category) params.category = filters.category;
        if (filters.level) params.level = filters.level;

        const { data } = await getCourses(params);
        setCourses(data.courses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Courses</h1>
          <p className="text-primary-100 text-lg">
            Offline training & online e-learning programmes
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <CourseFilter filters={filters} setFilters={setFilters} />

          {loading ? (
            <Loader />
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No courses found.</p>
              <button
                onClick={() =>
                  setFilters({ search: "", courseType: "", category: "", level: "" })
                }
                className="text-primary-600 mt-2 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CoursesPage;