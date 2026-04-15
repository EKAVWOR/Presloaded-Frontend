import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import toast from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Forgot Password</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {sent ? (
          <div className="text-center">
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <p className="text-green-700 text-sm">
                A password reset link has been sent to <strong>{email}</strong>.
              </p>
            </div>
            <Link to="/login" className="text-primary-600 hover:underline text-sm">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field !pl-10"
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <p className="text-center">
              <Link to="/login" className="text-primary-600 text-sm hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default ForgotPasswordPage;