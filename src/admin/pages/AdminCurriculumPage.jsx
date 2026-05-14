// src/admin/pages/AdminCurriculumPage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaPlus, FaTrash, FaEdit, FaVideo, FaCheck,
  FaChevronDown, FaChevronUp, FaArrowLeft, FaEye,
  FaEyeSlash, FaUpload,
} from "react-icons/fa";
import {
  getCurriculum, addSection, updateSection, deleteSection,
  addLesson, updateLesson, deleteLesson, uploadLessonVideo,
} from "../../services/adminService";
import API from "../../services/api";
import Loader from "../../components/common/Loader";

const AdminCurriculumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  // Section form
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addingSection, setAddingSection] = useState(false);

  // Lesson form
  const [addingLesson, setAddingLesson] = useState({});
  const [newLesson, setNewLesson] = useState({});

  // Edit
  const [editingSection, setEditingSection] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  // Upload
  const [uploadingLesson, setUploadingLesson] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ NEW: Track which lesson is being toggled (prevents double-click)
  const [togglingLesson, setTogglingLesson] = useState(null);

  useEffect(() => {
    loadCurriculum();
    loadCourseInfo();
  }, [id]);

  const loadCourseInfo = async () => {
    try {
      const { data } = await API.get(`/courses/admin/all`);
      const found = data.courses?.find((c) => c._id === id);
      setCourse(found || null);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCurriculum = async () => {
    setLoading(true);
    try {
      const { data } = await getCurriculum(id);
      setSections(data.sections || []);
      setStats(data.stats || {});
      const expanded = {};
      (data.sections || []).forEach((s) => {
        expanded[s._id] = true;
      });
      setExpandedSections(expanded);
    } catch (err) {
      toast.error("Failed to load curriculum");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // ===== SECTION HANDLERS =====
  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) {
      return toast.error("Section title is required");
    }
    setAddingSection(true);
    try {
      await addSection(id, { title: newSectionTitle.trim() });
      setNewSectionTitle("");
      toast.success("Section added");
      loadCurriculum();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add section");
    } finally {
      setAddingSection(false);
    }
  };

  const handleUpdateSection = async (sectionId, title) => {
    try {
      await updateSection(id, sectionId, { title });
      toast.success("Section updated");
      setEditingSection(null);
      loadCurriculum();
    } catch (err) {
      toast.error("Failed to update section");
    }
  };

  const handleDeleteSection = async (sectionId, title) => {
    if (!confirm(`Delete section "${title}" and all its lessons?`)) return;
    try {
      await deleteSection(id, sectionId);
      toast.success("Section deleted");
      loadCurriculum();
    } catch (err) {
      toast.error("Failed to delete section");
    }
  };

  // ===== LESSON HANDLERS =====
  const startAddLesson = (sectionId) => {
    setAddingLesson({ [sectionId]: true });
    setNewLesson({ title: "", description: "", isFree: false, isPublished: false });
  };

  const handleAddLesson = async (sectionId) => {
    if (!newLesson.title?.trim()) {
      return toast.error("Lesson title is required");
    }
    try {
      await addLesson(id, sectionId, {
        title: newLesson.title.trim(),
        description: newLesson.description?.trim() || "",
        isFree: newLesson.isFree || false,
        isPublished: newLesson.isPublished || false,
      });
      setAddingLesson({});
      setNewLesson({});
      toast.success("Lesson added");
      loadCurriculum();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add lesson");
    }
  };

  const handleUpdateLesson = async (sectionId, lessonId, data) => {
    try {
      await updateLesson(id, sectionId, lessonId, data);
      toast.success("Lesson updated");
      setEditingLesson(null);
      loadCurriculum();
    } catch (err) {
      toast.error("Failed to update lesson");
    }
  };

  const handleDeleteLesson = async (sectionId, lessonId, title) => {
    if (!confirm(`Delete lesson "${title}"?`)) return;
    try {
      await deleteLesson(id, sectionId, lessonId);
      toast.success("Lesson deleted");
      loadCurriculum();
    } catch (err) {
      toast.error("Failed to delete lesson");
    }
  };

  // ✅ NEW: Quick publish/unpublish toggle
  const handleTogglePublish = async (sectionId, lesson) => {
    if (togglingLesson === lesson._id) return; // prevent double-click

    if (!lesson.videoUrl && !lesson.isPublished) {
      return toast.error("Upload a video before publishing this lesson");
    }

    setTogglingLesson(lesson._id);
    const newStatus = !lesson.isPublished;

    // ✅ Optimistic UI update
    setSections((prev) =>
      prev.map((s) =>
        s._id === sectionId
          ? {
              ...s,
              lessons: s.lessons.map((l) =>
                l._id === lesson._id ? { ...l, isPublished: newStatus } : l
              ),
            }
          : s
      )
    );

    try {
      await updateLesson(id, sectionId, lesson._id, {
        isPublished: newStatus,
      });
      toast.success(
        newStatus ? "✅ Lesson published — visible to students!" : "Lesson moved to draft"
      );
    } catch (err) {
      // Rollback on error
      setSections((prev) =>
        prev.map((s) =>
          s._id === sectionId
            ? {
                ...s,
                lessons: s.lessons.map((l) =>
                  l._id === lesson._id ? { ...l, isPublished: !newStatus } : l
                ),
              }
            : s
        )
      );
      toast.error("Failed to update lesson status");
    } finally {
      setTogglingLesson(null);
    }
  };

  // ✅ NEW: Bulk publish all lessons in a section
  const handlePublishAllInSection = async (section) => {
    const draftLessons = (section.lessons || []).filter(
      (l) => !l.isPublished && l.videoUrl
    );

    if (draftLessons.length === 0) {
      return toast.error("No draft lessons with videos to publish");
    }

    if (!confirm(`Publish ${draftLessons.length} draft lesson(s) in "${section.title}"?`)) {
      return;
    }

    try {
      await Promise.all(
        draftLessons.map((lesson) =>
          updateLesson(id, section._id, lesson._id, { isPublished: true })
        )
      );
      toast.success(`✅ Published ${draftLessons.length} lesson(s)!`);
      loadCurriculum();
    } catch (err) {
      toast.error("Failed to publish all lessons");
    }
  };

  // ===== VIDEO UPLOAD =====
  const handleVideoUpload = async (sectionId, lessonId, file) => {
    if (!file) return;

    if (file.size > 1024 * 1024 * 1024) {
      return toast.error("File too large. Max 1GB");
    }

    const allowedTypes = ["video/mp4", "video/mov", "video/avi", "video/mkv", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      return toast.error("Invalid file type. Use mp4, mov, avi, mkv or webm");
    }

    setUploadingLesson(lessonId);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("video", file);

    try {
      await uploadLessonVideo(id, sectionId, lessonId, formData, (progress) => {
        setUploadProgress(progress);
      });
      toast.success("Video uploaded successfully!");
      loadCurriculum();
    } catch (err) {
      toast.error(err.response?.data?.message || "Video upload failed");
    } finally {
      setUploadingLesson(null);
      setUploadProgress(0);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ✅ NEW: Calculate publish stats
  const getPublishStats = () => {
    let total = 0;
    let published = 0;
    sections.forEach((s) => {
      (s.lessons || []).forEach((l) => {
        total++;
        if (l.isPublished) published++;
      });
    });
    return { total, published, drafts: total - published };
  };

  if (loading) return <Loader />;

  const publishStats = getPublishStats();

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/courses")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-3 text-sm"
        >
          <FaArrowLeft /> Back to Courses
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Curriculum Builder</h1>
        {course && (
          <p className="text-gray-500 text-sm mt-1">{course.title}</p>
        )}
      </div>

      {/* ✅ Publish Status Banner */}
      {publishStats.drafts > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 flex items-start gap-3">
          <div className="text-yellow-600 mt-0.5">⚠️</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-900">
              {publishStats.drafts} lesson{publishStats.drafts !== 1 && "s"} in draft
            </p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Draft lessons are hidden from students. Click the eye icon on each lesson to publish.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{stats.totalSections || 0}</p>
          <p className="text-sm text-gray-500">Sections</p>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{stats.totalLessons || 0}</p>
          <p className="text-sm text-gray-500">Total Lessons</p>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{publishStats.published}</p>
          <p className="text-sm text-gray-500">Published</p>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-400">{publishStats.drafts}</p>
          <p className="text-sm text-gray-500">Drafts</p>
        </div>
      </div>

      {/* Add Section */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="font-semibold mb-3">Add New Section</h2>
        <div className="flex gap-2">
          <input
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
            placeholder="e.g. Introduction to JavaScript"
            className="input-field flex-1"
          />
          <button
            onClick={handleAddSection}
            disabled={addingSection}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <FaPlus />
            {addingSection ? "Adding..." : "Add Section"}
          </button>
        </div>
      </div>

      {/* Sections */}
      {sections.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-xl">
          <FaVideo size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No sections yet. Add your first section above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections
            .sort((a, b) => a.order - b.order)
            .map((section, sIndex) => {
              const sectionDrafts = (section.lessons || []).filter(
                (l) => !l.isPublished && l.videoUrl
              ).length;

              return (
                <div key={section._id} className="bg-white border rounded-xl overflow-hidden">
                  {/* Section Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-bold text-gray-400 w-6">
                        {sIndex + 1}
                      </span>

                      {editingSection === section._id ? (
                        <input
                          defaultValue={section.title}
                          onBlur={(e) =>
                            handleUpdateSection(section._id, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleUpdateSection(section._id, e.target.value);
                            if (e.key === "Escape") setEditingSection(null);
                          }}
                          autoFocus
                          className="input-field flex-1 py-1"
                        />
                      ) : (
                        <h3 className="font-semibold text-gray-800">
                          {section.title}
                          <span className="text-xs text-gray-400 font-normal ml-2">
                            ({section.lessons?.length || 0} lessons)
                          </span>
                        </h3>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-3">
                      {/* ✅ NEW: Bulk publish button */}
                      {sectionDrafts > 0 && (
                        <button
                          onClick={() => handlePublishAllInSection(section)}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition flex items-center gap-1"
                          title={`Publish all ${sectionDrafts} draft lessons`}
                        >
                          <FaEye size={10} />
                          Publish All ({sectionDrafts})
                        </button>
                      )}
                      <button
                        onClick={() => setEditingSection(section._id)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 transition"
                        title="Edit section"
                      >
                        <FaEdit size={13} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteSection(section._id, section.title)
                        }
                        className="p-1.5 text-gray-400 hover:text-red-500 transition"
                        title="Delete section"
                      >
                        <FaTrash size={13} />
                      </button>
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                      >
                        {expandedSections[section._id] ? (
                          <FaChevronUp size={13} />
                        ) : (
                          <FaChevronDown size={13} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Lessons */}
                  {expandedSections[section._id] && (
                    <div className="p-4 space-y-3">
                      {section.lessons
                        ?.sort((a, b) => a.order - b.order)
                        .map((lesson, lIndex) => (
                          <div
                            key={lesson._id}
                            className={`border rounded-lg p-4 transition ${
                              lesson.isPublished
                                ? "bg-white border-gray-200"
                                : "bg-gray-50 border-gray-300"
                            }`}
                          >
                            {editingLesson === lesson._id ? (
                              /* Edit Lesson Form */
                              <div className="space-y-3">
                                <input
                                  defaultValue={lesson.title}
                                  id={`lesson-title-${lesson._id}`}
                                  placeholder="Lesson title"
                                  className="input-field w-full"
                                />
                                <textarea
                                  defaultValue={lesson.description}
                                  id={`lesson-desc-${lesson._id}`}
                                  placeholder="Lesson description (optional)"
                                  rows={2}
                                  className="input-field w-full resize-none"
                                />
                                <label className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    id={`lesson-free-${lesson._id}`}
                                    defaultChecked={lesson.isFree}
                                  />
                                  Free preview lesson
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    id={`lesson-pub-${lesson._id}`}
                                    defaultChecked={lesson.isPublished}
                                  />
                                  Published (visible to students)
                                </label>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleUpdateLesson(
                                        section._id,
                                        lesson._id,
                                        {
                                          title: document.getElementById(
                                            `lesson-title-${lesson._id}`
                                          ).value,
                                          description: document.getElementById(
                                            `lesson-desc-${lesson._id}`
                                          ).value,
                                          isFree: document.getElementById(
                                            `lesson-free-${lesson._id}`
                                          ).checked,
                                          isPublished: document.getElementById(
                                            `lesson-pub-${lesson._id}`
                                          ).checked,
                                        }
                                      )
                                    }
                                    className="btn-primary text-sm py-1.5"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingLesson(null)}
                                    className="btn-secondary text-sm py-1.5"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Lesson View */
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <span className="text-xs text-gray-400 mt-0.5 w-5">
                                    {lIndex + 1}
                                  </span>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className="font-medium text-gray-800 text-sm">
                                        {lesson.title}
                                      </p>
                                      {lesson.isFree && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                          Free
                                        </span>
                                      )}

                                      {/* ✅ CLICKABLE Publish Toggle Badge */}
                                      <button
                                        onClick={() => handleTogglePublish(section._id, lesson)}
                                        disabled={togglingLesson === lesson._id}
                                        className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition ${
                                          lesson.isPublished
                                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                        } ${
                                          togglingLesson === lesson._id ? "opacity-50" : ""
                                        }`}
                                        title={
                                          lesson.isPublished
                                            ? "Click to unpublish"
                                            : "Click to publish"
                                        }
                                      >
                                        {lesson.isPublished ? (
                                          <>
                                            <FaEye size={10} /> Published
                                          </>
                                        ) : (
                                          <>
                                            <FaEyeSlash size={10} /> Draft (click to publish)
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    {lesson.description && (
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {lesson.description}
                                      </p>
                                    )}
                                    {/* Video status */}
                                    <div className="flex items-center gap-3 mt-2">
                                      {lesson.videoUrl ? (
                                        <span className="text-xs text-green-600 flex items-center gap-1">
                                          <FaCheck size={10} />
                                          Video uploaded
                                          {lesson.videoDuration > 0 &&
                                            ` (${formatDuration(lesson.videoDuration)})`}
                                        </span>
                                      ) : (
                                        <span className="text-xs text-orange-500 flex items-center gap-1">
                                          <FaVideo size={10} /> No video yet — upload to publish
                                        </span>
                                      )}
                                    </div>

                                    {/* Upload progress */}
                                    {uploadingLesson === lesson._id && (
                                      <div className="mt-2">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                          <span>Uploading...</span>
                                          <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                          <div
                                            className="bg-primary-600 h-1.5 rounded-full transition-all"
                                            style={{ width: `${uploadProgress}%` }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Lesson Actions */}
                                <div className="flex items-center gap-1.5">
                                  {/* Upload Video */}
                                  <label
                                    className="p-1.5 text-gray-400 hover:text-primary-600 transition cursor-pointer"
                                    title="Upload video"
                                  >
                                    <FaUpload size={13} />
                                    <input
                                      type="file"
                                      accept="video/*"
                                      className="hidden"
                                      disabled={uploadingLesson === lesson._id}
                                      onChange={(e) =>
                                        handleVideoUpload(
                                          section._id,
                                          lesson._id,
                                          e.target.files[0]
                                        )
                                      }
                                    />
                                  </label>
                                  <button
                                    onClick={() => setEditingLesson(lesson._id)}
                                    className="p-1.5 text-gray-400 hover:text-primary-600 transition"
                                    title="Edit lesson"
                                  >
                                    <FaEdit size={13} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteLesson(
                                        section._id,
                                        lesson._id,
                                        lesson.title
                                      )
                                    }
                                    className="p-1.5 text-gray-400 hover:text-red-500 transition"
                                    title="Delete lesson"
                                  >
                                    <FaTrash size={13} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                      {/* Add Lesson Form */}
                      {addingLesson[section._id] ? (
                        <div className="border rounded-lg p-4 bg-blue-50 border-blue-200 space-y-3">
                          <h4 className="text-sm font-semibold text-blue-800">
                            New Lesson
                          </h4>
                          <input
                            value={newLesson.title || ""}
                            onChange={(e) =>
                              setNewLesson((p) => ({ ...p, title: e.target.value }))
                            }
                            placeholder="Lesson title *"
                            className="input-field w-full"
                          />
                          <textarea
                            value={newLesson.description || ""}
                            onChange={(e) =>
                              setNewLesson((p) => ({
                                ...p,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Description (optional)"
                            rows={2}
                            className="input-field w-full resize-none"
                          />
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={newLesson.isFree || false}
                              onChange={(e) =>
                                setNewLesson((p) => ({
                                  ...p,
                                  isFree: e.target.checked,
                                }))
                              }
                            />
                            Free preview lesson
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={newLesson.isPublished || false}
                              onChange={(e) =>
                                setNewLesson((p) => ({
                                  ...p,
                                  isPublished: e.target.checked,
                                }))
                              }
                            />
                            Publish immediately (otherwise saved as draft)
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddLesson(section._id)}
                              className="btn-primary text-sm py-1.5"
                            >
                              Add Lesson
                            </button>
                            <button
                              onClick={() => {
                                setAddingLesson({});
                                setNewLesson({});
                              }}
                              className="btn-secondary text-sm py-1.5"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => startAddLesson(section._id)}
                          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition flex items-center justify-center gap-2"
                        >
                          <FaPlus size={11} /> Add Lesson
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default AdminCurriculumPage;