import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { createCourse, updateCourse, uploadThumbnail } from "../../services/adminService";
import { COURSE_CATEGORIES } from "../../../utils/constants";

const COURSE_TYPES = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline (In-Person)" },
];

const LEVELS = ["beginner", "intermediate", "advanced"];

const emptyLesson = { title: "", duration: "" };
const emptyModule = { title: "", lessons: [{ ...emptyLesson }] };

const CourseForm = ({ existingCourse = null }) => {
  const navigate = useNavigate();
  const isEditing = !!existingCourse;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    courseType: "online",
    category: "",
    level: "beginner",
    price: "",
    discountPrice: "",
    location: "",
    schedule: "",
    onlinePlatformUrl: "",
    thumbnail: "",
    curriculum: [{ ...emptyModule }],
    isPublished: false,
  });

  const isOffline = form.courseType === "offline";

  useEffect(() => {
    if (!existingCourse) return;

    setForm({
      title: existingCourse.title || "",
      shortDescription: existingCourse.shortDescription || "",
      description: existingCourse.description || "",
      courseType: (existingCourse.courseType || "online").toLowerCase(),
      category: existingCourse.category || "",
      level: (existingCourse.level || "beginner").toLowerCase(),
      price: existingCourse.price || "",
      discountPrice: existingCourse.discountPrice || "",
      location: existingCourse.location || "",
      schedule: existingCourse.schedule || "",
      onlinePlatformUrl: existingCourse.onlinePlatformUrl || "",
      thumbnail: existingCourse.thumbnail || "",
      curriculum: existingCourse.curriculum?.length > 0
        ? existingCourse.curriculum.map((m) => ({
            title: m.title || "",
            lessons: m.lessons?.length > 0 ? m.lessons : [{ ...emptyLesson }],
          }))
        : [{ ...emptyModule }],
      isPublished: existingCourse.isPublished || false,
    });
  }, [existingCourse]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addModule = () => {
    setForm((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, { ...emptyModule }],
    }));
  };

  const removeModule = (index) => {
    setForm((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index),
    }));
  };

  const handleModuleTitle = (index, value) => {
    setForm((prev) => {
      const curriculum = [...prev.curriculum];
      curriculum[index].title = value;
      return { ...prev, curriculum };
    });
  };

  const addLesson = (moduleIndex) => {
    setForm((prev) => {
      const curriculum = [...prev.curriculum];
      curriculum[moduleIndex].lessons.push({ ...emptyLesson });
      return { ...prev, curriculum };
    });
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    setForm((prev) => {
      const curriculum = [...prev.curriculum];
      curriculum[moduleIndex].lessons.splice(lessonIndex, 1);
      return { ...prev, curriculum };
    });
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    setForm((prev) => {
      const curriculum = [...prev.curriculum];
      curriculum[moduleIndex].lessons[lessonIndex][field] = value;
      return { ...prev, curriculum };
    });
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("thumbnail", file);

    setUploading(true);
    try {
      const { data } = await uploadThumbnail(formData);
      setForm((prev) => ({ ...prev, thumbnail: data.url }));
      toast.success("Thumbnail uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        courseType: form.courseType,
        category: form.category,
        level: form.level,
        price: Number(form.price) || 0,
        discountPrice: Number(form.discountPrice) || 0,
        thumbnail: form.thumbnail,
        curriculum: form.curriculum
          .filter((m) => m.title.trim())
          .map((m) => ({
            title: m.title.trim(),
            lessons: m.lessons.filter((l) => l.title.trim()),
          })),
        isPublished: form.isPublished,
      };

      if (isOffline) {
        payload.location = form.location.trim();
        payload.schedule = form.schedule.trim();
      } else {
        payload.onlinePlatformUrl = form.onlinePlatformUrl.trim();
      }

      if (isEditing) {
        await updateCourse(existingCourse._id, payload);
        toast.success("Course updated successfully!");
      } else {
        await createCourse(payload);
        toast.success("Course created successfully!");
      }

      navigate("/admin/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* BASIC INFORMATION */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Basic Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Course Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Short Description *</label>
            <input
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course Type *</label>
              <select
                name="courseType"
                value={form.courseType}
                onChange={handleChange}
                className="input-field"
              >
                {COURSE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Category</option>
                {COURSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="input-field"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* DELIVERY DETAILS */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">
          {isOffline ? "Offline Course Details" : "Online Course Details"}
        </h2>

        {isOffline ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g. Ikeja, Lagos"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Schedule</label>
              <input
                name="schedule"
                value={form.schedule}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Mon - Fri, 9am - 3pm"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">Platform URL *</label>
            <input
              name="onlinePlatformUrl"
              value={form.onlinePlatformUrl}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="https://yourplatform.com/course"
            />
          </div>
        )}
      </div>

      {/* PRICING */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (₦) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount Price (₦)</label>
            <input
              type="number"
              name="discountPrice"
              value={form.discountPrice}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* THUMBNAIL */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Thumbnail</h2>
        <div className="flex items-center gap-4">
          {form.thumbnail && (
            <img src={form.thumbnail} alt="Thumbnail" className="w-32 h-20 object-cover rounded" />
          )}
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm flex items-center gap-2">
            <FaUpload /> {uploading ? "Uploading..." : "Upload"}
            <input type="file" onChange={handleThumbnailUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* CURRICULUM */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Curriculum</h2>

        {form.curriculum.map((module, mIndex) => (
          <div key={mIndex} className="border rounded-lg p-4 mb-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <input
                value={module.title}
                onChange={(e) => handleModuleTitle(mIndex, e.target.value)}
                placeholder="Module Title"
                className="input-field font-medium"
              />
              {form.curriculum.length > 1 && (
                <button type="button" onClick={() => removeModule(mIndex)} className="text-red-500 ml-2">
                  <FaTrash />
                </button>
              )}
            </div>

            {module.lessons.map((lesson, lIndex) => (
              <div key={lIndex} className="flex gap-2 mb-2">
                <input
                  value={lesson.title}
                  onChange={(e) => handleLessonChange(mIndex, lIndex, "title", e.target.value)}
                  placeholder="Lesson title"
                  className="input-field flex-1"
                />
                <input
                  value={lesson.duration}
                  onChange={(e) => handleLessonChange(mIndex, lIndex, "duration", e.target.value)}
                  placeholder="Duration"
                  className="input-field w-32"
                />
                {module.lessons.length > 1 && (
                  <button type="button" onClick={() => removeLesson(mIndex, lIndex)} className="text-red-500">
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={() => addLesson(mIndex)} className="text-sm text-primary-600 mt-1">
              + Add Lesson
            </button>
          </div>
        ))}

        <button type="button" onClick={addModule} className="text-primary-600 flex items-center gap-1">
          <FaPlus /> Add Module
        </button>
      </div>

      {/* SETTINGS */}
      <div className="bg-white rounded-xl border p-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
          />
          <span>Publish this course</span>
        </label>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
        </button>
        <button type="button" onClick={() => navigate("/admin/courses")} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CourseForm;