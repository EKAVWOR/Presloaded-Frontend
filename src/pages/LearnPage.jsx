// src/pages/LearnPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaCheckCircle, FaLock, FaChevronDown, FaChevronUp,
  FaArrowLeft, FaCertificate, FaComment, FaPaperPlane,
  FaCircle,
} from "react-icons/fa";
import {
  getEnrollment,
  updateProgress,
  getLessonComments,
  addLessonComment,
  replyToComment,
} from "../services/enrollmentService";
import VideoPlayer from "../components/common/VideoPlayer";
import Loader from "../components/common/Loader";

const LearnPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState({});
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // ✅ Helper: Check if a lesson is completed
  const isLessonDone = useCallback(
    (lessonId) => {
      return (
        enrollment?.progress?.some(
          (p) =>
            p.lessonId?.toString() === lessonId?.toString() && p.completed
        ) || false
      );
    },
    [enrollment]
  );

  // ✅ Helper: Get sections (handles both sections and curriculum)
  const getSections = useCallback(() => {
    if (!enrollment?.course) return [];
    const sections =
      enrollment.course.sections?.length > 0
        ? enrollment.course.sections
        : enrollment.course.curriculum || [];

    return sections
      .map((s) => ({
        ...s,
        lessons: (s.lessons || []).filter((l) => l.isPublished !== false),
      }))
      .filter((s) => s.lessons.length > 0);
  }, [enrollment]);

  useEffect(() => {
    loadEnrollment();
  }, [slug]);

  const loadEnrollment = async () => {
    setLoading(true);
    try {
      const { data } = await getEnrollment(slug);
      const enrollData = data.enrollment;
      setEnrollment(enrollData);

      const sections =
        enrollData.course?.sections?.length > 0
          ? enrollData.course.sections
          : enrollData.course?.curriculum || [];

      const filteredSections = sections
        .map((s) => ({
          ...s,
          lessons: (s.lessons || []).filter((l) => l.isPublished !== false),
        }))
        .filter((s) => s.lessons.length > 0);

      if (filteredSections.length > 0) {
        let nextLesson = null;
        let firstLesson = null;

        for (const section of filteredSections) {
          for (const lesson of section.lessons) {
            if (!firstLesson) {
              firstLesson = { lesson, sectionId: section._id };
            }
            const done = enrollData.progress?.some(
              (p) =>
                p.lessonId?.toString() === lesson._id?.toString() &&
                p.completed
            );
            if (!done && !nextLesson) {
              nextLesson = { lesson, sectionId: section._id };
            }
          }
        }

        const target = nextLesson || firstLesson;
        if (target) {
          setActiveLesson(target.lesson);
          setActiveSectionId(target.sectionId);
        }

        const expanded = {};
        filteredSections.forEach((s) => (expanded[s._id] = true));
        setExpandedSections(expanded);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        toast.error("You are not enrolled in this course");
        navigate("/dashboard");
      } else {
        toast.error("Failed to load course");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = (lesson, sectionId) => {
    if (activeLesson?._id === lesson._id) return;
    setActiveLesson(lesson);
    setActiveSectionId(sectionId);
    setComments([]);
    setShowComments(false);
    setNewComment("");
  };

  const handleProgress = useCallback(
    async (watchedDuration, completed) => {
      if (!activeLesson || !enrollment) return;
      try {
        const { data } = await updateProgress(slug, activeLesson._id, {
          watchedDuration,
          completed,
        });

        setEnrollment((prev) => ({
          ...prev,
          completionPercentage:
            data.enrollment?.completionPercentage ||
            prev.completionPercentage,
          progress: data.enrollment?.progress || prev.progress,
          completedAt: data.enrollment?.completedAt || prev.completedAt,
          certificateNumber:
            data.enrollment?.certificateNumber || prev.certificateNumber,
        }));

        if (data.progress?.certificateIssued) {
          toast.success("🎓 Course completed! Certificate issued!", {
            duration: 6000,
          });
        }
      } catch (err) {
        console.error("Progress update failed:", err.message);
      }
    },
    [activeLesson, enrollment, slug]
  );

  const handleLessonComplete = useCallback(() => {
    if (!activeLesson) return;
    const sections = getSections();
    let foundCurrent = false;

    for (const section of sections) {
      for (let i = 0; i < section.lessons.length; i++) {
        if (foundCurrent) {
          handleSelectLesson(section.lessons[i], section._id);
          return;
        }
        if (section.lessons[i]._id === activeLesson._id) {
          foundCurrent = true;
        }
      }
    }
  }, [activeLesson, getSections]);

  const loadComments = async () => {
    if (!enrollment || !activeLesson) return;
    try {
      const { data } = await getLessonComments(slug, activeLesson._id);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Failed to load comments:", err.message);
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => {
      if (!prev) loadComments();
      return !prev;
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const { data } = await addLessonComment(slug, activeLesson._id, {
        text: newComment.trim(),
      });
      setNewComment("");
      // Add new comment to top of list
      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
      } else {
        loadComments();
      }
      toast.success("Comment added");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReply = async (commentId) => {
    const content = replyContent[commentId];
    if (!content?.trim()) return;
    try {
      const { data } = await replyToComment(slug, activeLesson._id, commentId, {
        text: content.trim(),
      });
      setReplyContent((p) => ({ ...p, [commentId]: "" }));
      // Add reply to the comment locally
      if (data.reply) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, replies: [...(c.replies || []), data.reply] }
              : c
          )
        );
      } else {
        loadComments();
      }
      toast.success("Reply added");
    } catch (err) {
      toast.error("Failed to add reply");
    }
  };

  const getCompletedCount = () => {
    return enrollment?.progress?.filter((p) => p.completed).length || 0;
  };

  if (loading) return <Loader />;
  if (!enrollment || !enrollment.course) return null;

  const course = enrollment.course;
  const sections = getSections();
  const completionPercentage = enrollment.completionPercentage || 0;
  const isCompleted = completionPercentage >= 100;
  const totalLessons = sections.reduce(
    (acc, s) => acc + s.lessons.length,
    0
  );

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-xl border p-10 max-w-md text-center shadow-sm">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Lessons Available Yet
          </h2>
          <p className="text-gray-600 mb-6">
            The instructor hasn't published any lessons for{" "}
            <strong>{course.title}</strong> yet. Please check back soon!
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition"
          >
            <FaArrowLeft size={12} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* ========== SIDEBAR ========== */}
      <aside className="lg:w-80 xl:w-96 bg-white border-r flex-shrink-0 lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto">
        {/* Course Header */}
        <div className="p-4 border-b bg-primary-700 text-white">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-primary-200 hover:text-white text-sm mb-3 transition"
          >
            <FaArrowLeft size={12} /> Back to Dashboard
          </Link>
          <h2 className="font-bold text-sm leading-tight line-clamp-2">
            {course.title}
          </h2>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-primary-200 mb-1">
              <span>
                {getCompletedCount()} / {totalLessons} lessons
              </span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-primary-600 rounded-full h-1.5">
              <div
                className="bg-green-400 h-1.5 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Certificate Banner */}
        {isCompleted && enrollment.certificateNumber && (
          <Link
            to={`/certificate/${enrollment.certificateNumber}`}
            className="flex items-center gap-3 p-3 bg-green-50 border-b border-green-100 text-green-700 hover:bg-green-100 transition"
          >
            <FaCertificate className="text-green-500 flex-shrink-0" />
            <span className="text-sm font-medium">View Your Certificate</span>
          </Link>
        )}

        {/* Sections & Lessons */}
        <div className="divide-y">
          {sections.map((section, sIdx) => (
            <div key={section._id || sIdx}>
              <button
                onClick={() =>
                  setExpandedSections((p) => ({
                    ...p,
                    [section._id]: !p[section._id],
                  }))
                }
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-left"
              >
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Section {sIdx + 1}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    {section.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {section.lessons.filter((l) => isLessonDone(l._id)).length}/
                    {section.lessons.length} completed
                  </p>
                </div>
                {expandedSections[section._id] ? (
                  <FaChevronUp size={12} className="text-gray-400 flex-shrink-0" />
                ) : (
                  <FaChevronDown size={12} className="text-gray-400 flex-shrink-0" />
                )}
              </button>

              {expandedSections[section._id] && (
                <div>
                  {section.lessons.map((lesson) => {
                    const done = isLessonDone(lesson._id);
                    const isActive = activeLesson?._id === lesson._id;
                    return (
                      <button
                        key={lesson._id}
                        onClick={() =>
                          handleSelectLesson(lesson, section._id)
                        }
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition ${
                          isActive
                            ? "bg-primary-50 border-r-2 border-primary-600"
                            : ""
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {done ? (
                            <FaCheckCircle size={14} className="text-green-500" />
                          ) : lesson.videoUrl ? (
                            <FaCircle
                              size={14}
                              className={
                                isActive ? "text-primary-600" : "text-gray-300"
                              }
                            />
                          ) : (
                            <FaLock size={12} className="text-gray-300 mt-0.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-tight ${
                              isActive
                                ? "text-primary-700 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {lesson.title}
                          </p>
                          {lesson.videoDuration > 0 && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {Math.floor(lesson.videoDuration / 60)}:
                              {(lesson.videoDuration % 60).toString().padStart(2, "0")}
                            </p>
                          )}
                          {lesson.isFree && (
                            <span className="text-xs text-green-600 font-medium">
                              Preview
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 overflow-y-auto">
        {activeLesson ? (
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            <VideoPlayer
              key={activeLesson._id}
              src={activeLesson.videoUrl}
              lessonId={activeLesson._id}
              onProgress={handleProgress}
              onComplete={handleLessonComplete}
            />

            {/* Lesson Info */}
            <div className="mt-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {activeLesson.title}
                  </h1>
                  {activeLesson.description && (
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {activeLesson.description}
                    </p>
                  )}
                </div>
                {isLessonDone(activeLesson._id) && (
                  <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex-shrink-0">
                    <FaCheckCircle /> Completed
                  </span>
                )}
              </div>
            </div>

            {/* Resources */}
            {activeLesson.resources?.length > 0 && (
              <div className="mt-6 bg-white border rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Lesson Resources
                </h3>
                <div className="space-y-2">
                  {activeLesson.resources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition text-sm text-primary-600 hover:text-primary-700"
                    >
                      📎 {r.title || r.url}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="mt-6 bg-white border rounded-xl overflow-hidden">
              <button
                onClick={toggleComments}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaComment className="text-primary-600" />
                  Discussion
                  {comments.length > 0 && (
                    <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                      {comments.length}
                    </span>
                  )}
                </h3>
                {showComments ? (
                  <FaChevronUp size={13} className="text-gray-400" />
                ) : (
                  <FaChevronDown size={13} className="text-gray-400" />
                )}
              </button>

              {showComments && (
                <div className="border-t p-5">
                  <div className="flex gap-3 mb-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ask a question or share your thoughts..."
                      rows={2}
                      className="input-field flex-1 resize-none"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={submittingComment || !newComment.trim()}
                      className="btn-primary px-4 self-end flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaPaperPlane size={13} />
                      {submittingComment ? "..." : "Post"}
                    </button>
                  </div>

                  {comments.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">
                      No comments yet. Be the first to ask a question!
                    </p>
                  ) : (
                    <div className="space-y-5">
                      {comments.map((comment) => (
                        <div key={comment._id}>
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {comment.user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-sm font-semibold text-gray-800">
                                  {comment.user?.name || "User"}
                                </span>
                                {comment.user?.role === "admin" && (
                                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                                    Instructor
                                  </span>
                                )}
                                <span className="text-xs text-gray-400">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {comment.text}
                              </p>

                              {comment.replies?.length > 0 && (
                                <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-3">
                                  {comment.replies.map((reply) => (
                                    <div key={reply._id} className="flex gap-2">
                                      <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {reply.user?.name?.[0]?.toUpperCase() || "U"}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="text-xs font-semibold text-gray-700">
                                            {reply.user?.name || "User"}
                                          </span>
                                          {reply.user?.role === "admin" && (
                                            <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0 rounded-full">
                                              Instructor
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-600 mt-0.5">
                                          {reply.text}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="flex gap-2 mt-2">
                                <input
                                  value={replyContent[comment._id] || ""}
                                  onChange={(e) =>
                                    setReplyContent((p) => ({
                                      ...p,
                                      [comment._id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Reply..."
                                  className="input-field flex-1 text-sm py-1.5"
                                />
                                <button
                                  onClick={() => handleReply(comment._id)}
                                  disabled={!replyContent[comment._id]?.trim()}
                                  className="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-40 px-2"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <p className="text-gray-400 text-lg">
                Select a lesson to start learning
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LearnPage;