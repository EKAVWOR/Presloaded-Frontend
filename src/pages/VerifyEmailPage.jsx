import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/common/Loader";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const { loadUser } = useAuth();
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        await loadUser();
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };
    if (token) verify();
  }, [token, loadUser]);

  if (status === "loading") return <Loader fullScreen />;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === "success" ? (
          <>
            <FaCheckCircle size={60} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
            <p className="text-gray-600 mb-6">
              Your email has been verified successfully. You can now purchase courses.
            </p>
            <Link to="/courses" className="btn-primary">Browse Courses</Link>
          </>
        ) : (
          <>
            <FaTimesCircle size={60} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-6">
              The verification link is invalid or has expired.
            </p>
            <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          </>
        )}
      </div>
    </section>
  );
};

export default VerifyEmailPage;