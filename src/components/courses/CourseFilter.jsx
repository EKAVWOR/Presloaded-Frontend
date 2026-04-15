import { COURSE_CATEGORIES, COURSE_LEVELS } from "../../../utils/constants";
import { FaSearch } from "react-icons/fa";

const CourseFilter = ({ filters, setFilters }) => {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            className="input-field !pl-10"
          />
        </div>

        {/* Type */}
        <select
          value={filters.courseType}
          onChange={(e) => update("courseType", e.target.value)}
          className="input-field"
        >
          <option value="">All Types</option>
          <option value="offline">Offline (In-Person)</option>
          <option value="online">Online (E-Learning)</option>
        </select>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => update("category", e.target.value)}
          className="input-field"
        >
          <option value="">All Categories</option>
          {COURSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Level */}
        <select
          value={filters.level}
          onChange={(e) => update("level", e.target.value)}
          className="input-field"
        >
          <option value="">All Levels</option>
          {COURSE_LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CourseFilter;