// src/admin/pages/AdminCurriculumPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaVideo,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaYoutube,
} from "react-icons/fa";
import {
  getCurriculum,
  addSection,
  updateSection,
  deleteSection,
  addLesson,
  updateLesson,
  deleteLesson,
  uploadLessonVideo,
} from "../../services/adminService";
import API from "../../services/api";
import Loader from "../../components/common/Loader";

// ============================================================
// ✅ YouTube Helpers
// ============================================================
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/
  );
  return match ? match[1] : null;
};

const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const isValidYouTubeUrl = (url) => {
  return getYouTubeVideoId(url) !== null;
};

// ============================================================
// Main Component
// ============================================================
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

  // Toggle publish
  const [togglingLesson, setTogglingLesson] = useState(null);

  // ✅ YouTube Modal state
  const [youtubeModal, setYoutubeModal] = useState(null); // { sectionId, lessonId }
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [savingYoutube, setSavingYoutube] = useState(false);

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
      console.error("Failed to load course info:", err);
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
      console.error(err);
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
    setNewLesson({
      title: "",
      description: "",
      isFree: false,
      isPublished: false,
    });
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

  // ===== PUBLISH HANDLERS =====
  const handleTogglePublish = async (sectionId, lesson) => {
    if (togglingLesson === lesson._id) return;

    if (!lesson.videoUrl && !lesson.isPublished) {
      return toast.error("Add a video before publishing this lesson");
    }

    setTogglingLesson(lesson._id);
    const newStatus = !lesson.isPublished;

    // Optimistic UI update
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
        newStatus ? "✅ Lesson published!" : "Lesson moved to draft"
      );
    } catch (err) {
      // Rollback on error
      setSections((prev) =>
        prev.map((s) =>
          s._id === sectionId
            ? {
                ...s,
                lessons: s.lessons.map((l) =>
                  l._id === lesson._id
                    ? { ...l, isPublished: !newStatus }
                    : l
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

  const handlePublishAllInSection = async (section) => {
    const draftLessons = (section.lessons || []).filter(
      (l) => !l.isPublished && l.videoUrl
    );

    if (draftLessons.length === 0) {
      return toast.error("No draft lessons with videos to publish");
    }

    if (
      !confirm(
        `Publish ${draftLessons.length} draft lesson(s) in "${section.title}"?`
      )
    ) {
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

  // ============================================================
  // ✅ YOUTUBE URL HANDLER
  // ============================================================
  const handleSaveYouTubeUrl = async () => {
    if (!youtubeUrl.trim()) {
      return toast.error("Please enter a YouTube URL");
    }

    const videoId = getYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      return toast.error(
        "Invalid YouTube URL. Use format: https://youtu.be/VIDEO_ID"
      );
    }

    setSavingYoutube(true);

    try {
      await uploadLessonVideo(
        id,
        youtubeModal.sectionId,
        youtubeModal.lessonId,
        {
          videoUrl: youtubeUrl.trim(),
          videoType: "youtube",
          videoPublicId: videoId,
          thumbnailUrl: getYouTubeThumbnail(videoId),
          videoDuration: 0,
        }
      );

      toast.success("✅ YouTube video added!");
      setYoutubeModal(null);
      setYoutubeUrl("");
      loadCurriculum();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save YouTube URL"
      );
    } finally {
      setSavingYoutube(false);
    }
  };

  // ===== HELPERS =====
  const formatDuration = (seconds) => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/courses")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-3 text-sm transition"
        >
          <FaArrowLeft /> Back to Courses
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Curriculum Builder
        </h1>
        {course && (
          <p className="text-gray-500 text-sm mt-1">{course.title}</p>
        )}
      </div>

      {/* ✅ YouTube Info Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
        <FaYoutube className="text-red-600 text-2xl mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-900 mb-1">
            📺 Use YouTube for video hosting (FREE & Unlimited)
          </p>
          <ol className="text-xs text-red-700 space-y-0.5 list-decimal list-inside">
            <li>
              Upload your video to{" "}
              <a
                href="https://youtube.com/upload"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                youtube.com/upload
              </a>
            </li>
            <li>
              Set visibility to <strong>"Unlisted"</strong> (not Public!)
            </li>
            <li>
              Copy the URL and click the red YouTube button on a lesson
            </li>
          </ol>
        </div>
      </div>

      {/* Publish Status Banner */}
      {publishStats.drafts > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 flex items-start gap-3">
          <div className="text-yellow-600 mt-0.5">⚠️</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-900">
              {publishStats.drafts} lesson
              {publishStats.drafts !== 1 && "s"} in draft
            </p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Draft lessons are hidden from students. Click the eye icon to
              publish.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-primary-600">
            {stats.totalSections || 0}
          </p>
          <p className="text-sm text-gray-500">Sections</p>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-primary-600">
            {stats.totalLessons || 0}
          </p>
          <p className="text-sm text-gray-500">Total Lessons</p>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">
            {publishStats.published}
          </p>
          <p className="text-sm text-gray-500">Published</p>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-400">
            {publishStats.drafts}
          </p>
          <p className="text-sm text-gray-500">Drafts</p>
        </div>
      </div>

      {/* Add Section */}
      <div className="bg-white border rounded-xl p-4 mb-6 shadow-sm">
        <h2 className="font-semibold mb-3 text-gray-800">Add New Section</h2>
        <div className="flex gap-2">
          <input
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
            placeholder="e.g. Introduction to JavaScript"
            className="input-field flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleAddSection}
            disabled={addingSection}
            className="btn-primary flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
          >
            <FaPlus />
            {addingSection ? "Adding..." : "Add Section"}
          </button>
        </div>
      </div>

      {/* Sections */}
      {sections.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-xl shadow-sm">
          <FaVideo size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            No sections yet. Add your first section above.
          </p>
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
                <div
                  key={section._id}
                  className="bg-white border rounded-xl overflow-hidden shadow-sm"
                >
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
                              handleUpdateSection(
                                section._id,
                                e.target.value
                              );
                            if (e.key === "Escape")
                              setEditingSection(null);
                          }}
                          autoFocus
                          className="input-field flex-1 py-1 px-2 border rounded"
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
                                  className="input-field w-full px-3 py-2 border rounded"
                                />
                                <textarea
                                  defaultValue={lesson.description}
                                  id={`lesson-desc-${lesson._id}`}
                                  placeholder="Lesson description (optional)"
                                  rows={2}
                                  className="input-field w-full resize-none px-3 py-2 border rounded"
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
                                          description:
                                            document.getElementById(
                                              `lesson-desc-${lesson._id}`
                                            ).value,
                                          isFree: document.getElementById(
                                            `lesson-free-${lesson._id}`
                                          ).checked,
                                          isPublished:
                                            document.getElementById(
                                              `lesson-pub-${lesson._id}`
                                            ).checked,
                                        }
                                      )
                                    }
                                    className="btn-primary text-sm py-1.5 px-4 bg-primary-600 text-white rounded hover:bg-primary-700"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingLesson(null)}
                                    className="btn-secondary text-sm py-1.5 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
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
                                      <button
                                        onClick={() =>
                                          handleTogglePublish(
                                            section._id,
                                            lesson
                                          )
                                        }
                                        disabled={
                                          togglingLesson === lesson._id
                                        }
                                        className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition ${
                                          lesson.isPublished
                                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                        } ${
                                          togglingLesson === lesson._id
                                            ? "opacity-50"
                                            : ""
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
                                            <FaEyeSlash size={10} /> Draft
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    {lesson.description && (
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {lesson.description}
                                      </p>
                                    )}

                                    {/* ✅ Video Status (shows type) */}
                                    <div className="flex items-center gap-3 mt-2">
                                      {lesson.videoUrl ? (
                                        <span className="text-xs flex items-center gap-1">
                                          {lesson.videoType === "youtube" ? (
                                            <>
                                              <FaYoutube
                                                className="text-red-600"
                                                size={12}
                                              />
                                              <span className="text-red-600 font-medium">
                                                YouTube video added
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <FaCheck
                                                className="text-green-600"
                                                size={10}
                                              />
                                              <span className="text-green-600">
                                                Video uploaded
                                                {lesson.videoDuration > 0 &&
                                                  ` (${formatDuration(
                                                    lesson.videoDuration
                                                  )})`}
                                              </span>
                                            </>
                                          )}
                                        </span>
                                      ) : (
                                        <span className="text-xs text-orange-500 flex items-center gap-1">
                                          <FaVideo size={10} /> No video yet
                                          — add YouTube link
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Lesson Actions */}
                                <div className="flex items-center gap-1.5">
                                  {/* ✅ YouTube Button */}
                                  <button
                                    onClick={() => {
                                      setYoutubeModal({
                                        sectionId: section._id,
                                        lessonId: lesson._id,
                                      });
                                      setYoutubeUrl(
                                        lesson.videoType === "youtube"
                                          ? lesson.videoUrl
                                          : ""
                                      );
                                    }}
                                    className="p-1.5 text-red-500 hover:text-red-700 transition"
                                    title={
                                      lesson.videoType === "youtube"
                                        ? "Update YouTube URL"
                                        : "Add YouTube video"
                                    }
                                  >
                                    <FaYoutube size={16} />
                                  </button>

                                  <button
                                    onClick={() =>
                                      setEditingLesson(lesson._id)
                                    }
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
                              setNewLesson((p) => ({
                                ...p,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Lesson title *"
                            className="input-field w-full px-3 py-2 border rounded"
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
                            className="input-field w-full resize-none px-3 py-2 border rounded"
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
                            Publish immediately
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddLesson(section._id)}
                              className="btn-primary text-sm py-1.5 px-4 bg-primary-600 text-white rounded hover:bg-primary-700"
                            >
                              Add Lesson
                            </button>
                            <button
                              onClick={() => {
                                setAddingLesson({});
                                setNewLesson({});
                              }}
                              className="btn-secondary text-sm py-1.5 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
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

      {/* ✅ YouTube URL Modal */}
      {youtubeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <FaYoutube className="text-red-600 text-3xl" />
              <h2 className="text-xl font-bold">Add YouTube Video</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste any YouTube URL (regular, short, or embed link)
                </p>
              </div>

              {/* ✅ Live Preview */}
              {youtubeUrl && getYouTubeVideoId(youtubeUrl) && (
                <div>
                  <p className="text-sm font-medium mb-2 text-green-700">
                    ✅ Preview:
                  </p>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                        youtubeUrl
                      )}`}
                      title="YouTube preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Invalid URL Warning */}
              {youtubeUrl && !getYouTubeVideoId(youtubeUrl) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-700">
                    ❌ Invalid YouTube URL. Please use a format like:
                    <br />
                    <code className="bg-red-100 px-1 rounded">
                      https://youtu.be/VIDEO_ID
                    </code>
                  </p>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-900 mb-2">
                  📋 How to upload to YouTube:
                </p>
                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                  <li>
                    Go to{" "}
                    <a
                      href="https://youtube.com/upload"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      youtube.com/upload
                    </a>
                  </li>
                  <li>Upload your video</li>
                  <li>
                    Set visibility to <strong>"Unlisted"</strong> (NOT
                    Public!)
                  </li>
                  <li>Copy the video URL</li>
                  <li>Paste it above</li>
                </ol>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setYoutubeModal(null);
                    setYoutubeUrl("");
                  }}
                  disabled={savingYoutube}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveYouTubeUrl}
                  disabled={
                    savingYoutube ||
                    !youtubeUrl.trim() ||
                    !getYouTubeVideoId(youtubeUrl)
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FaYoutube />
                  {savingYoutube ? "Saving..." : "Save Video"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCurriculumPage;