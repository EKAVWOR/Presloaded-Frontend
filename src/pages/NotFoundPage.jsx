import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center">
      <h1 className="text-8xl font-extrabold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
      <p className="text-gray-500 mb-6">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  </section>
);

export default NotFoundPage;