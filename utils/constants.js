export const ACADEMY_NAME =
  import.meta.env.VITE_ACADEMY_NAME || "Presloaded Academy";
export const API_URL = import.meta.env.VITE_API_URL;
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
export const ELEARNING_URL =
  import.meta.env.VITE_ELEARNING_URL || "https://elearning.example.com";
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "";

export const CURRENCY = "₦";

export const COURSE_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Cybersecurity",
  "UI/UX Design",
  "Graphic Design",
  "Photography & Cinematography",
];

export const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Contact", path: "/contact" },
];

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/presloadedacademy",
  twitter: "https://twitter.com/presloadedacademy",
  instagram: "https://instagram.com/presloadedacademy",
  linkedin: "https://linkedin.com/companypresaloadedacademy",
};

export const COMPANY_INFO = {
  name: "Presloaded Academy",
  tagline: "Think, Create and Establish",
  logo: "../src/assets/logo.png", // Place your logo in public/logo.png
  website: "www.presloadedacademy.com",
  email: "presloadedacademy@gmail.com",
  signature: "../src/assets/signature.png", // Optional: signature image
  director: "Precious Goodluck Egilewe",
  directorTitle: "CEO",
};