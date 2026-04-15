// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   createCourse,
//   updateCourse,
//   uploadThumbnail,
// } from "../../services/adminService";
// import { COURSE_CATEGORIES, COURSE_LEVELS } from "../../../utils/constants";
// import toast from "react-hot-toast";
// import { FaUpload, FaPlus, FaTrash } from "react-icons/fa";

// const emptyCurriculum = { title: "", topics: [""] };

// const CourseForm = ({ existingCourse = null }) => {
//   const navigate = useNavigate();
//   const isEditing = !!existingCourse;

//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [form, setForm] = useState({
//     title: "",
//     shortDescription: "",
//     description: "",
//     courseType: "offline",
//     price: "",
//     discountPrice: "",
//     category: "",
//     level: "Beginner",
//     duration: "",
//     location: "",
//     startDate: "",
//     schedule: "",
//     onlinePlatformUrl: "",
//     thumbnail: "",
//     instructorName: "",
//     instructorTitle: "",
//     instructorBio: "",
//     whatYouWillLearn: [""],
//     requirements: [""],
//     curriculum: [{ ...emptyCurriculum }],
//     tags: "",
//     isPublished: false,
//     isFeatured: false,
//   });

//   useEffect(() => {
//     if (existingCourse) {
//       setForm({
//         title: existingCourse.title || "",
//         shortDescription: existingCourse.shortDescription || "",
//         description: existingCourse.description || "",
//         courseType: existingCourse.courseType || "offline",
//         price: existingCourse.price || "",
//         discountPrice: existingCourse.discountPrice || "",
//         category: existingCourse.category || "",
//         level: existingCourse.level || "Beginner",
//         duration: existingCourse.duration || "",
//         location: existingCourse.location || "",
//         startDate: existingCourse.startDate
//           ? existingCourse.startDate.substring(0, 10)
//           : "",
//         schedule: existingCourse.schedule || "",
//         onlinePlatformUrl: existingCourse.onlinePlatformUrl || "",
//         thumbnail: existingCourse.thumbnail || "",
//         instructorName: existingCourse.instructor?.name || "",
//         instructorTitle: existingCourse.instructor?.title || "",
//         instructorBio: existingCourse.instructor?.bio || "",
//         whatYouWillLearn:
//           existingCourse.whatYouWillLearn?.length > 0
//             ? existingCourse.whatYouWillLearn
//             : [""],
//         requirements:
//           existingCourse.requirements?.length > 0
//             ? existingCourse.requirements
//             : [""],
//         curriculum:
//           existingCourse.curriculum?.length > 0
//             ? existingCourse.curriculum.map((c) => ({
//                 title: c.title,
//                 topics: c.topics?.length > 0 ? c.topics : [""],
//               }))
//             : [{ ...emptyCurriculum }],
//         tags: existingCourse.tags?.join(", ") || "",
//         isPublished: existingCourse.isPublished || false,
//         isFeatured: existingCourse.isFeatured || false,
//       });
//     }
//   }, [existingCourse]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Dynamic list helpers
//   const handleListChange = (key, index, value) => {
//     setForm((prev) => {
//       const arr = [...prev[key]];
//       arr[index] = value;
//       return { ...prev, [key]: arr };
//     });
//   };

//   const addListItem = (key) => {
//     setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
//   };

//   const removeListItem = (key, index) => {
//     setForm((prev) => ({
//       ...prev,
//       [key]: prev[key].filter((_, i) => i !== index),
//     }));
//   };

//   // Curriculum helpers
//   const handleCurriculumTitle = (index, value) => {
//     setForm((prev) => {
//       const curr = [...prev.curriculum];
//       curr[index] = { ...curr[index], title: value };
//       return { ...prev, curriculum: curr };
//     });
//   };

//   const handleCurriculumTopic = (modIndex, topicIndex, value) => {
//     setForm((prev) => {
//       const curr = [...prev.curriculum];
//       const topics = [...curr[modIndex].topics];
//       topics[topicIndex] = value;
//       curr[modIndex] = { ...curr[modIndex], topics };
//       return { ...prev, curriculum: curr };
//     });
//   };

//   const addCurriculumTopic = (modIndex) => {
//     setForm((prev) => {
//       const curr = [...prev.curriculum];
//       curr[modIndex] = {
//         ...curr[modIndex],
//         topics: [...curr[modIndex].topics, ""],
//       };
//       return { ...prev, curriculum: curr };
//     });
//   };

//   const removeCurriculumTopic = (modIndex, topicIndex) => {
//     setForm((prev) => {
//       const curr = [...prev.curriculum];
//       curr[modIndex] = {
//         ...curr[modIndex],
//         topics: curr[modIndex].topics.filter((_, i) => i !== topicIndex),
//       };
//       return { ...prev, curriculum: curr };
//     });
//   };

//   const addCurriculumModule = () => {
//     setForm((prev) => ({
//       ...prev,
//       curriculum: [...prev.curriculum, { title: "", topics: [""] }],
//     }));
//   };

//   const removeCurriculumModule = (index) => {
//     setForm((prev) => ({
//       ...prev,
//       curriculum: prev.curriculum.filter((_, i) => i !== index),
//     }));
//   };

//   // Thumbnail upload
//   const handleThumbnailUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("thumbnail", file);

//     setUploading(true);
//     try {
//       const { data } = await uploadThumbnail(formData);
//       setForm((prev) => ({ ...prev, thumbnail: data.url }));
//       toast.success("Thumbnail uploaded!");
//     } catch (err) {
//       toast.error("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const courseData = {
//         title: form.title,
//         shortDescription: form.shortDescription,
//         description: form.description,
//         courseType: form.courseType,
//         price: Number(form.price) || 0,
//         discountPrice: Number(form.discountPrice) || 0,
//         category: form.category,
//         level: form.level,
//         duration: form.duration,
//         thumbnail: form.thumbnail,
//         isPublished: form.isPublished,
//         isFeatured: form.isFeatured,
//         instructor: {
//           name: form.instructorName,
//           title: form.instructorTitle,
//           bio: form.instructorBio,
//         },
//         whatYouWillLearn: form.whatYouWillLearn.filter((s) => s.trim()),
//         requirements: form.requirements.filter((s) => s.trim()),
//         curriculum: form.curriculum
//           .filter((m) => m.title.trim())
//           .map((m) => ({
//             title: m.title,
//             topics: m.topics.filter((t) => t.trim()),
//           })),
//         tags: form.tags
//           .split(",")
//           .map((t) => t.trim())
//           .filter(Boolean),
//       };

//       if (form.courseType === "offline") {
//         courseData.location = form.location;
//         courseData.startDate = form.startDate || undefined;
//         courseData.schedule = form.schedule;
//       } else {
//         courseData.onlinePlatformUrl = form.onlinePlatformUrl;
//       }

//       if (isEditing) {
//         await updateCourse(existingCourse._id, courseData);
//         toast.success("Course updated!");
//       } else {
//         await createCourse(courseData);
//         toast.success("Course created!");
//       }

//       navigate("/admin/courses");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
//       {/* BASIC INFO */}
//       <div className="bg-white rounded-xl border p-6">
//         <h2 className="text-lg font-bold mb-4">Basic Information</h2>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Course Title *
//             </label>
//             <input
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               required
//               className="input-field"
//               placeholder="e.g. Full Stack Web Development Bootcamp"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Short Description *
//             </label>
//             <input
//               name="shortDescription"
//               value={form.shortDescription}
//               onChange={handleChange}
//               required
//               maxLength={300}
//               className="input-field"
//               placeholder="Brief one-liner about the course"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Full Description *
//             </label>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               required
//               rows={6}
//               className="input-field resize-none"
//               placeholder="Detailed course description..."
//             />
//           </div>

//           <div className="grid sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Course Type *
//               </label>
//               <select
//                 name="courseType"
//                 value={form.courseType}
//                 onChange={handleChange}
//                 className="input-field"
//               >
//                 <option value="offline">Offline (In-Person)</option>
//                 <option value="online">Online (E-Learning)</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category *
//               </label>
//               <select
//                 name="category"
//                 value={form.category}
//                 onChange={handleChange}
//                 required
//                 className="input-field"
//               >
//                 <option value="">Select Category</option>
//                 {COURSE_CATEGORIES.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Level
//               </label>
//               <select
//                 name="level"
//                 value={form.level}
//                 onChange={handleChange}
//                 className="input-field"
//               >
//                 {COURSE_LEVELS.map((lvl) => (
//                   <option key={lvl} value={lvl}>
//                     {lvl}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Duration *
//               </label>
//               <input
//                 name="duration"
//                 value={form.duration}
//                 onChange={handleChange}
//                 required
//                 className="input-field"
//                 placeholder="e.g. 12 weeks"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* PRICING */}
//       <div className="bg-white rounded-xl border p-6">
//         <h2 className="text-lg font-bold mb-4">Pricing</h2>
//         <div className="grid sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Price (₦) *
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={form.price}
//               onChange={handleChange}
//               required
//               min="0"
//               className="input-field"
//               placeholder="e.g. 350000"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Discount Price (₦)
//             </label>
//             <input
//               type="number"
//               name="discountPrice"
//               value={form.discountPrice}
//               onChange={handleChange}
//               min="0"
//               className="input-field"
//               placeholder="Leave empty or 0 for no discount"
//             />
//           </div>
//         </div>
//       </div>

//       {/* COURSE TYPE SPECIFIC */}
//       {form.courseType === "offline" ? (
//         <div className="bg-white rounded-xl border p-6">
//           <h2 className="text-lg font-bold mb-4">Offline Course Details</h2>
//           <div className="space-y-4">
//             <div className="grid sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Location
//                 </label>
//                 <input
//                   name="location"
//                   value={form.location}
//                   onChange={handleChange}
//                   className="input-field"
//                   placeholder="e.g. Ikeja, Lagos"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={form.startDate}
//                   onChange={handleChange}
//                   className="input-field"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Schedule
//               </label>
//               <input
//                 name="schedule"
//                 value={form.schedule}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="e.g. Mon - Fri, 10:00 AM - 3:00 PM"
//               />
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl border p-6">
//           <h2 className="text-lg font-bold mb-4">Online Course Details</h2>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               E-Learning Platform URL *
//             </label>
//             <input
//               name="onlinePlatformUrl"
//               value={form.onlinePlatformUrl}
//               onChange={handleChange}
//               className="input-field"
//               placeholder="https://elearning.youracademy.com/course"
//             />
//           </div>
//         </div>
//       )}

//       {/* THUMBNAIL */}
//       <div className="bg-white rounded-xl border p-6">
//         <h2 className="text-lg font-bold mb-4">Thumbnail</h2>
//         <div className="flex items-start gap-6">
//           {form.thumbnail && (
//             <img
//               src={form.thumbnail}
//               alt="Thumbnail"
//               className="w-40 h-24 object-cover rounded-lg border"
//             />
//           )}
//           <div>
//             <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition">
//               <FaUpload />
//               {uploading ? "Uploading..." : "Upload Image"}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleThumbnailUpload}
//                 className="hidden"
//                 disabled={uploading}
//               />
//             </label>
//             <p className="text-xs text-gray-400 mt-2">
//               Recommended: 800×450px, max 5MB
//             </p>
//             <div className="mt-2">
//               <input
//                 name="thumbnail"
//                 value={form.thumbnail}
//                 onChange={handleChange}
//                 className="input-field text-sm"
//                 placeholder="Or paste image URL directly"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* INSTRUCTOR */}
//       <div className="bg-white rounded-xl border p-6">
//         <h2 className="text-lg font-bold mb-4">Instructor</h2>
//         <div className="space-y-4">
//           <div className="grid sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Name *
//               </label>
//               <input
//                 name="instructorName"
//                 value={form.instructorName}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="Instructor name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Title
//               </label>
//               <input
//                 name="instructorTitle"
//                 value={form.instructorTitle}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="e.g. Senior Developer"
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Bio
//             </label>
//             <textarea
//               name="instructorBio"
//               value={form.instructorBio}
//               onChange={handleChange}
//               rows={3}
//               className="input-field resize-none"
//               placeholder="Short bio..."
//             />
//           </div>
//         </div>
//       </div>

//       {/* WHAT YOU WILL LEARN */}
//       <div className="bg-white rounded-xl border p-6">
//         <h2 className="text-lg font-bold mb-4">What Students Will Learn</h2>
//         {form.whatYouWillLearn.map((item, i) => (
//           <div key={i} className="flex items-center gap-2 mb-2">
//             <input
//               value={item}
//               onChange={(e) =>
//                 handleListChange("whatYouWillLearn", i, e.target.value)
//               }
//               className="input-field"
//               placeholder={`Learning outcome ${i + 1}`}
//             />
//             {form.whatYouWillLearn.length > 1 && (
//               <button
//                 type="button"
//                 onClick={() => removeListItem("whatYouWillLearn", i)}
//                 className="text-red-500 hover:text-red-700 p-2"
//               >
//                 <FaTrash size={14} />
//               </button>
//             )}
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => addListItem("whatYouWillLearn")}
//           className="flex items-center gap-1 text-primary-600 text-sm font-medium mt-2 hover:underline"
//         >
//           <FaPlus size={12} /> Add item
//         </button>
//       </div>

//       {/* REQUIREMENTS */}
//       <div className="bg-white rounded-xl border p-6">
//         <h2 className="text-lg font-bold mb-4">Requirements</h2>
//         {form.requirements.map((item, i) => (
//           <div key={i} className="flex items-center gap-2 mb-2">
//             <input
//               value={item}
//               onChange={(e) =>
//                 handleListChange("requirements", i, e.target.value)
//               }
//               className="input-field"
//               placeholder={`Requirement ${i + 1}`}
//             />
//             {form.requirements.length > 1 && (
//               <button
//                 type="button"
//                 onClick={() => removeListItem("requirements", i)}
//                 className="text-red-500 hover:text-red-700 p-2"
//               >
//                 <FaTrash size={14} />
//               </button>
//             )}
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => addListItem("requirements")}
//           className="flex items-center gap-1 text-primary-600 text-sm font-medium mt-2 hover:underline"
//         >
//           <FaPlus size={12} /> Add requirement
//         </button>
//       </div>

//       {/* CURRICULUM */}
//       <div className="bg-white rounded-xl border p-6">
//         <h2 className="text-lg font-bold mb-4">Curriculum</h2>
//         {form.curriculum.map((mod, modIndex) => (
//           <div
//             key={modIndex}
//             className="border rounded-lg p-4 mb-4 bg-gray-50"
//           >
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="font-semibold text-gray-700">
//                 Module {modIndex + 1}
//               </h3>
//               {form.curriculum.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeCurriculumModule(modIndex)}
//                   className="text-red-500 text-sm hover:underline"
//                 >
//                   Remove Module
//                 </button>
//               )}
//             </div>
//             <input
//               value={mod.title}
//               onChange={(e) =>
//                 handleCurriculumTitle(modIndex, e.target.value)
//               }
//               className="input-field mb-3"
//               placeholder="Module title"
//             />
//             <p className="text-sm text-gray-500 mb-2">Topics:</p>
//             {mod.topics.map((topic, topicIndex) => (
//               <div key={topicIndex} className="flex items-center gap-2 mb-2">
//                 <input
//                   value={topic}
//                   onChange={(e) =>
//                     handleCurriculumTopic(modIndex, topicIndex, e.target.value)
//                   }
//                   className="input-field"
//                   placeholder={`Topic ${topicIndex + 1}`}
//                 />
//                 {mod.topics.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() =>
//                       removeCurriculumTopic(modIndex, topicIndex)
//                     }
//                     className="text-red-500 p-2"
//                   >
//                     <FaTrash size={12} />
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => addCurriculumTopic(modIndex)}
//               className="text-primary-600 text-sm font-medium hover:underline"
//             >
//               + Add Topic
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={addCurriculumModule}
//           className="flex items-center gap-1 text-primary-600 font-medium hover:underline"
//         >
//           <FaPlus /> Add Module
//         </button>
//       </div>

//       {/* TAGS & FLAGS */}
//       <div className="bg-white rounded-xl border p-6">
//         <h2 className="text-lg font-bold mb-4">Tags & Settings</h2>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Tags (comma separated)
//             </label>
//             <input
//               name="tags"
//               value={form.tags}
//               onChange={handleChange}
//               className="input-field"
//               placeholder="e.g. react, javascript, web"
//             />
//           </div>
//           <div className="flex flex-wrap gap-6">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="isPublished"
//                 checked={form.isPublished}
//                 onChange={handleChange}
//                 className="w-4 h-4 rounded"
//               />
//               <span className="text-sm font-medium text-gray-700">
//                 Publish Course
//               </span>
//             </label>
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="isFeatured"
//                 checked={form.isFeatured}
//                 onChange={handleChange}
//                 className="w-4 h-4 rounded"
//               />
//               <span className="text-sm font-medium text-gray-700">
//                 Featured Course
//               </span>
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* SUBMIT */}
//       <div className="flex items-center gap-4">
//         <button type="submit" disabled={loading} className="btn-primary">
//           {loading
//             ? "Saving..."
//             : isEditing
//             ? "Update Course"
//             : "Create Course"}
//         </button>
//         <button
//           type="button"
//           onClick={() => navigate("/admin/courses")}
//           className="btn-secondary"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CourseForm;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse, updateCourse, uploadThumbnail } from "../../services/adminService";
import { COURSE_CATEGORIES } from "../../../utils/constants";
import toast from "react-hot-toast";
import { FaUpload, FaPlus, FaTrash } from "react-icons/fa";

// Backend expects:
// courseType: "online" | "Offline" | "hybrid"   (case-sensitive)
// level: "beginner" | "intermediate" | "advanced" (based on your validation errors)
const COURSE_TYPE_OPTIONS = [
  { value: "online", label: "Online" },
  { value: "Offline", label: "Offline (In-Person)" },
  { value: "hybrid", label: "Hybrid" },
];

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const toApiCourseType = (v) => {
  if (!v) return "online";
  if (v === "Offline" || v === "online" || v === "hybrid") return v;

  const x = String(v).toLowerCase();
  if (x === "offline") return "Offline";
  if (x === "online") return "online";
  if (x === "hybrid") return "hybrid";
  return "online";
};

const toApiLevel = (v) => {
  if (!v) return "beginner";
  const x = String(v).toLowerCase();
  if (["beginner", "intermediate", "advanced"].includes(x)) return x;
  return "beginner";
};

// Backend curriculum shape:
// curriculum: [{ title: String, lessons: [{ title, duration, videoUrl }] }]
const emptyLesson = { title: "", duration: "", videoUrl: "" };
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
    duration: "",
    thumbnail: "",
    tags: "",
    requirements: [""],
    whatYouWillLearn: [""],
    curriculum: [{ ...emptyModule }],
    isPublished: false,
    isFeatured: false,
  });

  useEffect(() => {
    if (!existingCourse) return;

    setForm({
      title: existingCourse.title || "",
      shortDescription: existingCourse.shortDescription || "",
      description: existingCourse.description || "",
      courseType: toApiCourseType(existingCourse.courseType),
      category: existingCourse.category || "",
      level: toApiLevel(existingCourse.level),
      price: existingCourse.price ?? "",
      discountPrice: existingCourse.discountPrice ?? "",
      duration: existingCourse.duration || "",
      thumbnail: existingCourse.thumbnail || "",
      tags: Array.isArray(existingCourse.tags) ? existingCourse.tags.join(", ") : "",
      requirements:
        existingCourse.requirements?.length > 0 ? existingCourse.requirements : [""],
      whatYouWillLearn:
        existingCourse.whatYouWillLearn?.length > 0 ? existingCourse.whatYouWillLearn : [""],
      curriculum:
        existingCourse.curriculum?.length > 0
          ? existingCourse.curriculum.map((m) => ({
              title: m.title || "",
              lessons:
                m.lessons?.length > 0
                  ? m.lessons.map((l) => ({
                      title: l.title || "",
                      duration: l.duration || "",
                      videoUrl: l.videoUrl || "",
                    }))
                  : [{ ...emptyLesson }],
            }))
          : [{ ...emptyModule }],
      isPublished: !!existingCourse.isPublished,
      isFeatured: !!existingCourse.isFeatured,
    });
  }, [existingCourse]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Dynamic list helpers (string arrays)
  const handleListChange = (key, index, value) => {
    setForm((prev) => {
      const arr = [...prev[key]];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  };

  const addListItem = (key) => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  };

  const removeListItem = (key, index) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  // Curriculum (modules + lessons)
  const handleModuleTitle = (moduleIndex, value) => {
    setForm((prev) => {
      const curriculum = [...prev.curriculum];
      curriculum[moduleIndex] = { ...curriculum[moduleIndex], title: value };
      return { ...prev, curriculum };
    });
  };

  const addModule = () => {
    setForm((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, { ...emptyModule }],
    }));
  };

  const removeModule = (moduleIndex) => {
    setForm((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== moduleIndex),
    }));
  };

  const addLesson = (moduleIndex) => {
    setForm((prev) => {
      const curriculum = [...prev.curriculum];
      const mod = curriculum[moduleIndex];
      curriculum[moduleIndex] = {
        ...mod,
        lessons: [...(mod.lessons || []), { ...emptyLesson }],
      };
      return { ...prev, curriculum };
    });
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    setForm((prev) => {
      const curriculum = [...prev.curriculum];
      const mod = curriculum[moduleIndex];
      curriculum[moduleIndex] = {
        ...mod,
        lessons: (mod.lessons || []).filter((_, i) => i !== lessonIndex),
      };
      return { ...prev, curriculum };
    });
  };

  const handleLessonField = (moduleIndex, lessonIndex, field, value) => {
    setForm((prev) => {
      const curriculum = [...prev.curriculum];
      const mod = curriculum[moduleIndex];
      const lessons = [...(mod.lessons || [])];
      lessons[lessonIndex] = { ...lessons[lessonIndex], [field]: value };
      curriculum[moduleIndex] = { ...mod, lessons };
      return { ...prev, curriculum };
    });
  };

  // Thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("thumbnail", file);

    setUploading(true);
    try {
      const { data } = await uploadThumbnail(formData);
      setForm((prev) => ({ ...prev, thumbnail: data.url }));
      toast.success("Thumbnail uploaded!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        title: form.title?.trim(),
        shortDescription: form.shortDescription?.trim(),
        description: form.description,
        courseType: toApiCourseType(form.courseType),
        category: form.category,
        level: toApiLevel(form.level),
        price: Number(form.price) || 0,
        discountPrice: Number(form.discountPrice) || 0,
        duration: form.duration?.trim(),
        thumbnail: form.thumbnail?.trim(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        requirements: form.requirements.map((s) => s.trim()).filter(Boolean),
        whatYouWillLearn: form.whatYouWillLearn.map((s) => s.trim()).filter(Boolean),
        curriculum: form.curriculum
          .map((m) => ({
            title: (m.title || "").trim(),
            lessons: (m.lessons || [])
              .map((l) => ({
                title: (l.title || "").trim(),
                duration: (l.duration || "").trim(),
                videoUrl: (l.videoUrl || "").trim(),
              }))
              .filter((l) => l.title), // only lessons that have a title
          }))
          .filter((m) => m.title), // only modules that have a title
        isPublished: !!form.isPublished,
        isFeatured: !!form.isFeatured,
      };

      if (isEditing) {
        await updateCourse(existingCourse._id, courseData);
        toast.success("Course updated!");
      } else {
        await createCourse(courseData);
        toast.success("Course created!");
      }

      navigate("/admin/courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {/* BASIC INFO */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Basic Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={120}
              className="input-field"
              placeholder="e.g. Full Stack Web Development Bootcamp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description *
            </label>
            <input
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              required
              maxLength={300}
              className="input-field"
              placeholder="Brief one-liner about the course"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={6}
              className="input-field resize-none"
              placeholder="Detailed course description..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Type *
              </label>
              <select
                name="courseType"
                value={form.courseType}
                onChange={handleChange}
                className="input-field"
              >
                {COURSE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="input-field"
              >
                {LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="input-field"
                placeholder='e.g. "Self paced" or "12 weeks"'
              />
            </div>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₦) *
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              className="input-field"
              placeholder="e.g. 350000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Price (₦)
            </label>
            <input
              type="number"
              name="discountPrice"
              value={form.discountPrice}
              onChange={handleChange}
              min="0"
              className="input-field"
              placeholder="Leave empty or 0 for no discount"
            />
          </div>
        </div>
      </div>

      {/* THUMBNAIL */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Thumbnail</h2>
        <div className="flex items-start gap-6">
          {form.thumbnail && (
            <img
              src={form.thumbnail}
              alt="Thumbnail"
              className="w-40 h-24 object-cover rounded-lg border"
            />
          )}

          <div>
            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition">
              <FaUpload />
              {uploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>

            <p className="text-xs text-gray-400 mt-2">Recommended: 800×450px</p>

            <div className="mt-2">
              <input
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                className="input-field text-sm"
                placeholder="Or paste image URL directly"
              />
            </div>
          </div>
        </div>
      </div>

      {/* WHAT YOU WILL LEARN */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">What Students Will Learn</h2>

        {form.whatYouWillLearn.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              value={item}
              onChange={(e) => handleListChange("whatYouWillLearn", i, e.target.value)}
              className="input-field"
              placeholder={`Learning outcome ${i + 1}`}
            />
            {form.whatYouWillLearn.length > 1 && (
              <button
                type="button"
                onClick={() => removeListItem("whatYouWillLearn", i)}
                className="text-red-500 hover:text-red-700 p-2"
                aria-label="Remove learning outcome"
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => addListItem("whatYouWillLearn")}
          className="flex items-center gap-1 text-primary-600 text-sm font-medium mt-2 hover:underline"
        >
          <FaPlus size={12} /> Add item
        </button>
      </div>

      {/* REQUIREMENTS */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Requirements</h2>

        {form.requirements.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              value={item}
              onChange={(e) => handleListChange("requirements", i, e.target.value)}
              className="input-field"
              placeholder={`Requirement ${i + 1}`}
            />
            {form.requirements.length > 1 && (
              <button
                type="button"
                onClick={() => removeListItem("requirements", i)}
                className="text-red-500 hover:text-red-700 p-2"
                aria-label="Remove requirement"
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => addListItem("requirements")}
          className="flex items-center gap-1 text-primary-600 text-sm font-medium mt-2 hover:underline"
        >
          <FaPlus size={12} /> Add requirement
        </button>
      </div>

      {/* CURRICULUM */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Curriculum</h2>

        {form.curriculum.map((mod, modIndex) => (
          <div key={modIndex} className="border rounded-lg p-4 mb-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Module {modIndex + 1}</h3>
              {form.curriculum.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeModule(modIndex)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove Module
                </button>
              )}
            </div>

            <input
              value={mod.title}
              onChange={(e) => handleModuleTitle(modIndex, e.target.value)}
              className="input-field mb-4"
              placeholder="Module title"
            />

            <p className="text-sm text-gray-600 mb-2 font-medium">Lessons:</p>

            {mod.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="border rounded-md bg-white p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Lesson {lessonIndex + 1}
                  </p>

                  {mod.lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(modIndex, lessonIndex)}
                      className="text-red-500 p-2"
                      aria-label="Remove lesson"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    value={lesson.title}
                    onChange={(e) =>
                      handleLessonField(modIndex, lessonIndex, "title", e.target.value)
                    }
                    className="input-field"
                    placeholder="Lesson title"
                  />

                  <input
                    value={lesson.duration}
                    onChange={(e) =>
                      handleLessonField(modIndex, lessonIndex, "duration", e.target.value)
                    }
                    className="input-field"
                    placeholder='Duration (e.g. "12:30" or "45 mins")'
                  />

                  <input
                    value={lesson.videoUrl}
                    onChange={(e) =>
                      handleLessonField(modIndex, lessonIndex, "videoUrl", e.target.value)
                    }
                    className="input-field sm:col-span-2"
                    placeholder="Video URL (optional)"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addLesson(modIndex)}
              className="text-primary-600 text-sm font-medium hover:underline"
            >
              + Add Lesson
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addModule}
          className="flex items-center gap-1 text-primary-600 font-medium hover:underline"
        >
          <FaPlus /> Add Module
        </button>
      </div>

      {/* TAGS & FLAGS */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold mb-4">Tags & Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. react, javascript, web"
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Publish Course</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Featured Course</span>
            </label>
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
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