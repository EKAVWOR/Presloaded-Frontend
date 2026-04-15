import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const { data } = await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      login(data.token, data.user);
      toast.success("Account created! Please check your email to verify.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", type: "text", label: "Full Name", icon: <FaUser />, placeholder: "John Doe" },
    { name: "email", type: "email", label: "Email Address", icon: <FaEnvelope />, placeholder: "you@example.com" },
    { name: "phone", type: "tel", label: "Phone Number", icon: <FaPhone />, placeholder: "+234 xxx xxx xxxx" },
    { name: "password", type: "password", label: "Password", icon: <FaLock />, placeholder: "••••••••" },
    { name: "confirmPassword", type: "password", label: "Confirm Password", icon: <FaLock />, placeholder: "••••••••" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-2">Join Tech Academy today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {f.icon}
                </span>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  required={f.name !== "phone"}
                  className="input-field !pl-10"
                  placeholder={f.placeholder}
                />
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;