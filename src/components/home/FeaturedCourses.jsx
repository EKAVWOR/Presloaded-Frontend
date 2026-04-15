import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeaturedCourses } from "../../services/courseService";
import CourseCard from "../courses/CourseCard";
import Loader from "../common/Loader";

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getFeaturedCourses();
        setCourses(data.courses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular training programs designed by industry experts.
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">Courses coming soon!</p>
        )}

        <div className="text-center mt-10">
          <Link to="/courses" className="btn-primary">
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;