// src/pages/CoursesPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCourses } from "../services/courseService";
import CourseCard from "../components/courses/CourseCard";
import CourseFilter from "../components/courses/CourseFilter";
import Loader from "../components/common/Loader";
import { FaSearch, FaBookOpen } from "react-icons/fa";

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    courseType: searchParams.get("courseType") || "",
    category: searchParams.get("category") || "",
    level: searchParams.get("level") || "",
  });

  // ✅ Sync URL with filters
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

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

  // ✅ Quick stat
  const onlineCount = courses.filter((c) => c.courseType === "online").length;
  const offlineCount = courses.filter((c) => c.courseType === "offline").length;
  const freeCount = courses.filter((c) => c.isFree).length;

  const hasActiveFilters =
    filters.search ||
    filters.courseType ||
    filters.category ||
    filters.level;

  return (
    <>
      {/* ===== HEADER ===== */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-16 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-32 translate-y-32"></div>

        <div className="container-custom text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-4">
            <FaBookOpen size={12} />
            <span>Browse our catalog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Discover Your Next Skill
          </h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Choose from our offline training programmes and online e-learning
            courses
          </p>

          {/* Quick Stats */}
          {!loading && courses.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>{onlineCount} Online</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>{offlineCount} Offline</span>
              </div>
              {freeCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>{freeCount} Free</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="section-padding">
        <div className="container-custom">
          <CourseFilter filters={filters} setFilters={setFilters} />

          {/* Active Filters Display */}
          {hasActiveFilters && !loading && (
            <div className="flex items-center flex-wrap gap-2 mb-6">
              <span className="text-sm text-gray-500">Active filters:</span>
              {filters.search && (
                <FilterBadge
                  label={`Search: "${filters.search}"`}
                  onRemove={() =>
                    setFilters((p) => ({ ...p, search: "" }))
                  }
                />
              )}
              {filters.courseType && (
                <FilterBadge
                  label={
                    filters.courseType === "online"
                      ? "Online"
                      : "Offline"
                  }
                  onRemove={() =>
                    setFilters((p) => ({ ...p, courseType: "" }))
                  }
                />
              )}
              {filters.category && (
                <FilterBadge
                  label={filters.category}
                  onRemove={() =>
                    setFilters((p) => ({ ...p, category: "" }))
                  }
                />
              )}
              {filters.level && (
                <FilterBadge
                  label={
                    filters.level.charAt(0).toUpperCase() +
                    filters.level.slice(1)
                  }
                  onRemove={() =>
                    setFilters((p) => ({ ...p, level: "" }))
                  }
                />
              )}
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    courseType: "",
                    category: "",
                    level: "",
                  })
                }
                className="text-sm text-red-500 hover:text-red-700 ml-2 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          {!loading && courses.length > 0 && (
            <p className="text-sm text-gray-500 mb-4">
              Showing <strong>{courses.length}</strong> course
              {courses.length !== 1 && "s"}
            </p>
          )}

          {/* Courses Grid / Empty / Loading */}
          {loading ? (
            <div className="py-20">
              <Loader />
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              hasFilters={hasActiveFilters}
              onClearFilters={() =>
                setFilters({
                  search: "",
                  courseType: "",
                  category: "",
                  level: "",
                })
              }
            />
          )}
        </div>
      </section>
    </>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

const FilterBadge = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full border border-primary-200">
    {label}
    <button
      onClick={onRemove}
      className="hover:bg-primary-200 rounded-full w-4 h-4 flex items-center justify-center transition"
      aria-label="Remove filter"
    >
      ×
    </button>
  </span>
);

const EmptyState = ({ hasFilters, onClearFilters }) => (
  <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
      <FaSearch className="text-gray-300" size={28} />
    </div>
    <h3 className="text-xl font-bold text-gray-700 mb-2">
      {hasFilters ? "No courses match your filters" : "No courses available"}
    </h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      {hasFilters
        ? "Try adjusting your filters or clearing them to see all courses."
        : "Check back soon — new courses are added regularly!"}
    </p>
    {hasFilters && (
      <button
        onClick={onClearFilters}
        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg transition font-medium inline-flex items-center gap-2"
      >
        Clear All Filters
      </button>
    )}
  </div>
);

export default CoursesPage;