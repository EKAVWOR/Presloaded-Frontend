export const ACADEMY_NAME =
  import.meta.env.VITE_ACADEMY_NAME || "Tech Academy";
export const API_URL = import.meta.env.VITE_API_URL;
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
export const ELEARNING_URL =
  import.meta.env.VITE_ELEARNING_URL || "https://elearning.example.com";
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "";

export const CURRENCY = "₦";

export const COURSE_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "AI & Machine Learning",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "UI/UX Design",
  "Digital Marketing",
  "Product Management",
];

export const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Contact", path: "/contact" },
];

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/techacademy",
  twitter: "https://twitter.com/techacademy",
  instagram: "https://instagram.com/techacademy",
  linkedin: "https://linkedin.com/company/techacademy",
};