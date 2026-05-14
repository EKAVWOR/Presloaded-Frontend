// src/admin/components/CourseForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaPlus, FaTrash, FaUpload, FaVideo,
  FaInfoCircle, FaArrowRight,
} from "react-icons/fa";
import {
  createCourse,
  updateCourse,
  uploadThumbnail,
} from "../../services/adminService";
import { COURSE_CATEGORIES } from "../../../utils/constants";

const COURSE_TYPES = [
  { value: "online", label: "Online (Video-based)" },
  { value: "offline", label: "Offline (In-Person)" },
];

const LEVELS = ["beginner", "intermediate", "advanced"];

// Offline curriculum (title + duration only — no video)
const emptyLesson = { title: "", duration: "" };
const emptyModule = { title: "", lessons: [{ ...emptyLesson }] };

const CourseForm = ({ existingCourse = null }) => {
  const navigate = useNavigate();
  const isEditing = !!existingCourse;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState(null); // after create

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    courseType: "online",
    category: "",
    level: "beginner",
    instructor: "",
    language: "English",
    price: "",
    discountPrice: "",
    isFree: false,
    // Offline fields
    location: "",
    schedule: "",
    // Online fields
    onlinePlatformUrl: "",
    // Media
    thumbnail: "",
    // Offline curriculum only
    curriculum: [{ ...emptyModule }],
    // Online learning outcomes
    whatYouWillLearn: [""],
    requirements: [""],
    // Settings
    hasCertificate: true,
    isPublished: false,
  });

  const isOffline = form.courseType === "offline";
  const isOnline = form.courseType === "online";

  // ===== Populate form when editing =====
  useEffect(() => {
    if (!existingCourse) return;

    setForm({
      title: existingCourse.title || "",
      shortDescription: existingCourse.shortDescription || "",
      description: existingCourse.description || "",
      courseType: (existingCourse.courseType || "online").toLowerCase(),
      category: existingCourse.category || "",
      level: (existingCourse.level || "beginner").toLowerCase(),
      instructor: existingCourse.instructor || "",
      language: existingCourse.language || "English",
      price: existingCourse.price ?? "",
      discountPrice: existingCourse.discountPrice ?? "",
      isFree: existingCourse.isFree || false,
      location: existingCourse.location || "",
      schedule: existingCourse.schedule || "",
      onlinePlatformUrl: existingCourse.onlinePlatformUrl || "",
      thumbnail: existingCourse.thumbnail || "",
      curriculum:
        existingCourse.curriculum?.length > 0
          ? existingCourse.curriculum.map((m) => ({
              title: m.title || "",
              lessons:
                m.lessons?.length > 0
                  ? m.lessons.map((l) => ({
                      title: l.title || "",
                      duration: l.duration || "",
                    }))
                  : [{ ...emptyLesson }],
            }))
          : [{ ...emptyModule }],
      whatYouWillLearn:
        existingCourse.whatYouWillLearn?.length > 0
          ? existingCourse.whatYouWillLearn
          : [""],
      requirements:
        existingCourse.requirements?.length > 0
          ? existingCourse.requirements
          : [""],
      hasCertificate: existingCourse.hasCertificate ?? true,
      isPublished: existingCourse.isPublished || false,
    });
  }, [existingCourse]);

  // ===== Generic field change =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===== What You'll Learn =====
  const handleLearnItem = (index, value) => {
    setForm((prev) => {
      const arr = [...prev.whatYouWillLearn];
      arr[index] = value;
      return { ...prev, whatYouWillLearn: arr };
    });
  };

  const addLearnItem = () => {
    setForm((prev) => ({
      ...prev,
      whatYouWillLearn: [...prev.whatYouWillLearn, ""],
    }));
  };

  const removeLearnItem = (index) => {
    setForm((prev) => ({
      ...prev,
      whatYouWillLearn: prev.whatYouWillLearn.filter((_, i) => i !== index),
    }));
  };

  // ===== Requirements =====
  const handleRequirementItem = (index, value) => {
    setForm((prev) => {
      const arr = [...prev.requirements];
      arr[index] = value;
      return { ...prev, requirements: arr };
    });
  };

  const addRequirementItem = () => {
    setForm((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirementItem = (index) => {
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  // ===== Offline Curriculum =====
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
      curriculum[index] = { ...curriculum[index], title: value };
      return { ...prev, curriculum };
    });
  };

  const addLesson = (moduleIndex) => {
    setForm((prev) => {
      const curriculum = [...prev.curriculum];
      curriculum[moduleIndex] = {
        ...curriculum[moduleIndex],
        lessons: [...curriculum[moduleIndex].lessons, { ...emptyLesson }],
      };
      return { ...prev, curriculum };
    });
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    setForm((prev) => {
      const curriculum = [...prev.curriculum];
      curriculum[moduleIndex] = {
        ...curriculum[moduleIndex],
        lessons: curriculum[moduleIndex].lessons.filter(
          (_, i) => i !== lessonIndex
        ),
      };
      return { ...prev, curriculum };
    });
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    setForm((prev) => {
      const curriculum = [...prev.curriculum];
      const lessons = [...curriculum[moduleIndex].lessons];
      lessons[lessonIndex] = { ...lessons[lessonIndex], [field]: value };
      curriculum[moduleIndex] = { ...curriculum[moduleIndex], lessons };
      return { ...prev, curriculum };
    });
  };

  // ===== Thumbnail Upload =====
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return toast.error("Please upload a JPG, PNG or WebP image");
    }

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

  // ===== Submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (isOnline && !form.isFree && !form.onlinePlatformUrl.trim()) {
      return toast.error("Platform URL is required for online courses");
    }
    if (isOffline && !form.location.trim()) {
      return toast.error("Location is required for offline courses");
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        courseType: form.courseType,
        category: form.category,
        level: form.level,
        instructor: form.instructor.trim(),
        language: form.language.trim(),
        price: form.isFree ? 0 : Number(form.price) || 0,
        discountPrice: form.isFree ? 0 : Number(form.discountPrice) || 0,
        isFree: form.isFree,
        thumbnail: form.thumbnail,
        whatYouWillLearn: form.whatYouWillLearn.filter((s) => s.trim()),
        requirements: form.requirements.filter((s) => s.trim()),
        hasCertificate: form.hasCertificate,
        isPublished: form.isPublished,
      };

      // Type-specific fields
      if (isOffline) {
        payload.location = form.location.trim();
        payload.schedule = form.schedule.trim();
        payload.curriculum = form.curriculum
          .filter((m) => m.title.trim())
          .map((m) => ({
            title: m.title.trim(),
            lessons: m.lessons
              .filter((l) => l.title.trim())
              .map((l) => ({
                title: l.title.trim(),
                duration: l.duration.trim(),
              })),
          }));
      } else {
        // Online — curriculum/sections managed in Curriculum Builder
        payload.onlinePlatformUrl = form.onlinePlatformUrl.trim();
      }

      if (isEditing) {
        await updateCourse(existingCourse._id, payload);
        toast.success("Course updated successfully!");
        navigate("/admin/courses");
      } else {
        const { data } = await createCourse(payload);
        toast.success("Course created successfully!");

        // For online courses — redirect to curriculum builder
        if (isOnline) {
          setCreatedCourseId(data.course._id);
        } else {
          navigate("/admin/courses");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ===== Show redirect prompt after online course created =====
  if (createdCourseId) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
          <FaVideo size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Course Created! 🎉
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your online course has been created. Now let&apos;s build the
          curriculum — add sections, lessons and upload your videos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={`/admin/courses/${createdCourseId}/curriculum`}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <FaVideo /> Build Curriculum
            <FaArrowRight size={13} />
          </Link>
          <Link
            to="/admin/courses"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            Go to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">

      {/* ===== ONLINE COURSE INFO BANNER ===== */}
      {isOnline && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <FaInfoCircle className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Online Course Workflow</p>
            <ol className="list-decimal list-inside space-y-0.5 text-blue-700">
              <li>Fill in course details below and save</li>
              <li>Go to Curriculum Builder to add sections & lessons</li>
              <li>Upload videos for each lesson</li>
              <li>Publish when ready</li>
            </ol>
          </div>
        </div>
      )}

      {/* ===== BASIC INFORMATION ===== */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Basic Information</h2>
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">
              Course Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Complete Web Development Bootcamp"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Short Description *
            </label>
            <input
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              required
              maxLength={300}
              placeholder="Brief summary shown on course cards"
              className="input-field"
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.shortDescription.length}/300 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Full Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Detailed course description..."
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Instructor Name
              </label>
              <input
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <input
                name="language"
                value={form.language}
                onChange={handleChange}
                placeholder="e.g. English"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Course Type *
              </label>
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
              <label className="block text-sm font-medium mb-1">
                Category *
              </label>
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
                  <option key={lvl} value={lvl} className="capitalize">
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DELIVERY DETAILS ===== */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">
          {isOffline ? "Offline Course Details" : "Online Course Details"}
        </h2>

        {isOffline ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Location *
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required={isOffline}
                placeholder="e.g. Ikeja, Lagos"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Schedule</label>
              <input
                name="schedule"
                value={form.schedule}
                onChange={handleChange}
                placeholder="e.g. Mon - Fri, 9am - 3pm"
                className="input-field"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Free toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFree"
                checked={form.isFree}
                onChange={handleChange}
                className="w-4 h-4 accent-primary-600"
              />
              <div>
                <span className="text-sm font-medium text-gray-800">
                  Free Course
                </span>
                <p className="text-xs text-gray-500">
                  Students can enroll without payment
                </p>
              </div>
            </label>

            {/* Platform URL — only if not managed via our video system */}
            <div>
              <label className="block text-sm font-medium mb-1">
                External Platform URL
                <span className="text-gray-400 font-normal ml-1">
                  (optional if using built-in curriculum)
                </span>
              </label>
              <input
                name="onlinePlatformUrl"
                value={form.onlinePlatformUrl}
                onChange={handleChange}
                placeholder="https://yourplatform.com/course"
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">
                Leave empty if you&apos;ll upload videos directly in the
                Curriculum Builder
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ===== PRICING ===== */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Pricing</h2>

        {form.isFree && isOnline ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
            ✅ This is a free course. Students can enroll without payment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (₦) *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required={!form.isFree}
                min={0}
                placeholder="0"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Price (₦)
                <span className="text-gray-400 font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                type="number"
                name="discountPrice"
                value={form.discountPrice}
                onChange={handleChange}
                min={0}
                placeholder="0"
                className="input-field"
              />
              {form.discountPrice &&
                Number(form.discountPrice) >= Number(form.price) && (
                  <p className="text-xs text-red-500 mt-1">
                    Discount price must be less than the original price
                  </p>
                )}
            </div>
          </div>
        )}
      </div>

      {/* ===== THUMBNAIL ===== */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Course Thumbnail</h2>
        <div className="flex items-center gap-4">
          {form.thumbnail ? (
            <div className="relative">
              <img
                src={form.thumbnail}
                alt="Thumbnail"
                className="w-40 h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, thumbnail: "" }))}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-40 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
              <FaUpload size={20} />
            </div>
          )}
          <div>
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition w-fit">
              <FaUpload size={13} />
              {uploading ? "Uploading..." : "Upload Thumbnail"}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleThumbnailUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG or WebP. Recommended: 1280×720px
            </p>
          </div>
        </div>
      </div>

      {/* ===== WHAT YOU'LL LEARN (Online only) ===== */}
      {isOnline && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold mb-4">What Students Will Learn</h2>
          <div className="space-y-2">
            {form.whatYouWillLearn.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => handleLearnItem(i, e.target.value)}
                  placeholder={`Learning outcome ${i + 1}`}
                  className="input-field flex-1"
                />
                {form.whatYouWillLearn.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLearnItem(i)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <FaTrash size={13} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLearnItem}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1"
            >
              <FaPlus size={11} /> Add outcome
            </button>
          </div>
        </div>
      )}

      {/* ===== REQUIREMENTS (Online only) ===== */}
      {isOnline && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold mb-4">Requirements</h2>
          <div className="space-y-2">
            {form.requirements.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => handleRequirementItem(i, e.target.value)}
                  placeholder={`Requirement ${i + 1}`}
                  className="input-field flex-1"
                />
                {form.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRequirementItem(i)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <FaTrash size={13} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirementItem}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1"
            >
              <FaPlus size={11} /> Add requirement
            </button>
          </div>
        </div>
      )}

      {/* ===== OFFLINE CURRICULUM ===== */}
      {isOffline && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold mb-1">Curriculum Outline</h2>
          <p className="text-sm text-gray-500 mb-4">
            Add modules and lessons for your offline course
          </p>

          {form.curriculum.map((module, mIndex) => (
            <div
              key={mIndex}
              className="border rounded-lg p-4 mb-4 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-3 gap-2">
                <input
                  value={module.title}
                  onChange={(e) => handleModuleTitle(mIndex, e.target.value)}
                  placeholder={`Module ${mIndex + 1} title`}
                  className="input-field font-medium flex-1"
                />
                {form.curriculum.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeModule(mIndex)}
                    className="text-red-400 hover:text-red-600 transition flex-shrink-0"
                  >
                    <FaTrash size={13} />
                  </button>
                )}
              </div>

              {module.lessons.map((lesson, lIndex) => (
                <div key={lIndex} className="flex gap-2 mb-2">
                  <input
                    value={lesson.title}
                    onChange={(e) =>
                      handleLessonChange(mIndex, lIndex, "title", e.target.value)
                    }
                    placeholder="Lesson title"
                    className="input-field flex-1"
                  />
                  <input
                    value={lesson.duration}
                    onChange={(e) =>
                      handleLessonChange(
                        mIndex,
                        lIndex,
                        "duration",
                        e.target.value
                      )
                    }
                    placeholder="Duration e.g. 2hrs"
                    className="input-field w-36"
                  />
                  {module.lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(mIndex, lIndex)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <FaTrash size={13} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addLesson(mIndex)}
                className="text-sm text-primary-600 hover:text-primary-700 mt-1 flex items-center gap-1"
              >
                <FaPlus size={11} /> Add Lesson
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addModule}
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm font-medium"
          >
            <FaPlus size={13} /> Add Module
          </button>
        </div>
      )}

      {/* ===== ONLINE CURRICULUM NOTE ===== */}
      {isOnline && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
            <FaVideo className="text-primary-600" />
            Video Curriculum
          </h2>
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
            <p className="text-sm text-primary-800 font-medium mb-1">
              Videos are uploaded in the Curriculum Builder
            </p>
            <p className="text-sm text-primary-700">
              After saving this course, you&apos;ll be taken to the Curriculum
              Builder where you can:
            </p>
            <ul className="text-sm text-primary-700 list-disc list-inside mt-2 space-y-1">
              <li>Create sections and lessons</li>
              <li>Upload videos (up to 1GB each)</li>
              <li>Add free preview lessons</li>
              <li>Attach downloadable resources</li>
            </ul>
          </div>
          {isEditing && existingCourse?._id && (
            <Link
              to={`/admin/courses/${existingCourse._id}/curriculum`}
              className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm w-fit"
            >
              <FaVideo size={13} />
              Open Curriculum Builder
              <FaArrowRight size={12} />
            </Link>
          )}
        </div>
      )}

      {/* ===== SETTINGS ===== */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Settings</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="hasCertificate"
              checked={form.hasCertificate}
              onChange={handleChange}
              className="w-4 h-4 accent-primary-600"
            />
            <div>
              <span className="text-sm font-medium text-gray-800">
                Issue Certificate on Completion
              </span>
              <p className="text-xs text-gray-500">
                Students receive a PDF certificate when they finish the course
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
              className="w-4 h-4 accent-primary-600"
            />
            <div>
              <span className="text-sm font-medium text-gray-800">
                Publish this course
              </span>
              <p className="text-xs text-gray-500">
                Published courses are visible to students on the site
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* ===== ACTIONS ===== */}
      <div className="flex gap-4 pb-8">
        <button
          type="submit"
          disabled={loading || uploading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            "Saving..."
          ) : isEditing ? (
            "Update Course"
          ) : isOnline ? (
            <>
              Save & Build Curriculum
              <FaArrowRight size={13} />
            </>
          ) : (
            "Create Course"
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/courses")}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CourseForm;