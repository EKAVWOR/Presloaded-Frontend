import CourseForm from "../components/CourseForm";

const AdminAddCoursePage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Course</h1>
        <p className="text-gray-500 text-sm">
          Fill in the details to create a new course
        </p>
      </div>
      <CourseForm />
    </div>
  );
};

export default AdminAddCoursePage;