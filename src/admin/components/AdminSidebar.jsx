import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  FaTachometerAlt,
  FaBookOpen,
  FaPlusCircle,
  FaShoppingCart,
  FaUsers,
  FaEnvelope,
  FaNewspaper,
  FaSignOutAlt,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import { ACADEMY_NAME } from "../../../utils/constants";

const links = [
  { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt />, end: true },
  { name: "Courses", path: "/admin/courses", icon: <FaBookOpen /> },
  { name: "Add Course", path: "/admin/courses/new", icon: <FaPlusCircle /> },
  { name: "Orders", path: "/admin/orders", icon: <FaShoppingCart /> },
  { name: "Students", path: "/admin/students", icon: <FaUsers /> },
  { name: "Messages", path: "/admin/messages", icon: <FaEnvelope /> },
  { name: "Subscribers", path: "/admin/subscribers", icon: <FaNewspaper /> },
];

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">{ACADEMY_NAME}</h2>
        <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
      </div>

      {/* Links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-600 text-white border-r-4 border-primary-300"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-700 p-4 space-y-2">
        <NavLink
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition"
        >
          <FaArrowLeft /> Back to Website
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-lg transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded-lg"
      >
        <FaTachometerAlt />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-800 fixed top-0 left-0 h-screen z-40">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-800 z-50 flex flex-col md:hidden">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes size={20} />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default AdminSidebar;