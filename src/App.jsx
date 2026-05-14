// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { AuthProvider } from "./context/AuthContext";
// import { CartProvider } from "./context/CartContext";

// import Navbar from "./components/common/Navbar";
// import Footer from "./components/common/Footer";
// import ScrollToTop from "./components/common/ScrollToTop";
// import ProtectedRoute from "./components/common/ProtectedRoute";

// import HomePage from "./pages/HomePage";
// import AboutPage from "./pages/AboutPage";
// import CoursesPage from "./pages/CoursesPage";
// import CourseDetailPage from "./pages/CourseDetailPage";
// import CartPage from "./pages/CartPage";
// import CheckoutPage from "./pages/CheckoutPage";
// import PaymentSuccessPage from "./pages/PaymentSuccessPage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import VerifyEmailPage from "./pages/VerifyEmailPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";
// import DashboardPage from "./pages/DashboardPage";
// import ContactPage from "./pages/ContactPage";
// import NotFoundPage from "./pages/NotFoundPage";

// import "./index.css";


// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <Router>
//           <ScrollToTop />
//           <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
//           <Navbar />
//           <main className="min-h-screen">
//             <Routes>
//               {/* Public */}
//               <Route path="/" element={<HomePage />} />
//               <Route path="/about" element={<AboutPage />} />
//               <Route path="/courses" element={<CoursesPage />} />
//               <Route path="/courses/:slug" element={<CourseDetailPage />} />
//               <Route path="/cart" element={<CartPage />} />
//               <Route path="/contact" element={<ContactPage />} />
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/register" element={<RegisterPage />} />
//               <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
//               <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//               <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

//               {/* Protected */}
//               <Route
//                 path="/checkout"
//                 element={
//                   <ProtectedRoute>
//                     <CheckoutPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/payment-success"
//                 element={
//                   <ProtectedRoute>
//                     <PaymentSuccessPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard"
//                 element={
//                   <ProtectedRoute>
//                     <DashboardPage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route path="*" element={<NotFoundPage />} />
//             </Routes>
//           </main>
//           <Footer />
//         </Router>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminCoursesPage from "./admin/pages/AdminCoursesPage";
import AdminAddCoursePage from "./admin/pages/AdminAddCoursePage";
import AdminEditCoursePage from "./admin/pages/AdminEditCoursePage";
import AdminOrdersPage from "./admin/pages/AdminOrdersPage";
import AdminStudentsPage from "./admin/pages/AdminStudentsPage";
import AdminMessagesPage from "./admin/pages/AdminMessagesPage";
import AdminSubscribersPage from "./admin/pages/AdminSubscribersPage";

import LearnPage from "./pages/LearnPage";
import CertificatePage from "./pages/CertificatePage";
import AdminCurriculumPage from "./admin/pages/AdminCurriculumPage";   

// Layout wrapper for public pages (with Navbar + Footer)
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

          <Routes>
            {/* ================================ */}
            {/* PUBLIC PAGES (Navbar + Footer)   */}
            {/* ================================ */}
            <Route
              path="/" 
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <AboutPage />
                </PublicLayout>
              }
            />
            <Route
  path="/learn/:slug"
  element={
    <ProtectedRoute>
      <LearnPage />  {/* No PublicLayout — full screen player */}
    </ProtectedRoute>
  }
/>

            <Route
              path="/courses"
              element={
                <PublicLayout>
                  <CoursesPage />
                </PublicLayout>
              }
            />

            <Route
  path="/certificate/:certificateNumber"
  element={
    <PublicLayout>
      <CertificatePage />
    </PublicLayout>
  }
/>
            <Route
              path="/courses/:slug"
              element={
                <PublicLayout>
                  <CourseDetailPage />
                </PublicLayout>
              }
            />
            <Route
              path="/cart"
              element={
                <PublicLayout>
                  <CartPage />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <ContactPage />
                </PublicLayout>
              }
            />

            
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <LoginPage />
                </PublicLayout>
              }
            />
            <Route
              path="/register"
              element={
                <PublicLayout>
                  <RegisterPage />
                </PublicLayout>
              }
            />
            <Route
              path="/verify-email/:token"
              element={
                <PublicLayout>
                  <VerifyEmailPage />
                </PublicLayout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicLayout>
                  <ForgotPasswordPage />
                </PublicLayout>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <PublicLayout>
                  <ResetPasswordPage />
                </PublicLayout>
              }
            />

            {/* Protected Public Pages */}
            <Route
              path="/checkout"
              element={
                <PublicLayout>
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                </PublicLayout>
              }
            />
            <Route
              path="/payment-success"
              element={
                <PublicLayout>
                  <ProtectedRoute>
                    <PaymentSuccessPage />
                  </ProtectedRoute>
                </PublicLayout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PublicLayout>
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                </PublicLayout>
              }
            />

            {/* ================================ */}
            {/* ADMIN PAGES (No Navbar/Footer)   */}
            {/* ================================ */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >

              <Route
  path="courses/:id/curriculum"
  element={<AdminCurriculumPage />}
/>

              <Route index element={<AdminDashboardPage />} />
              <Route path="courses" element={<AdminCoursesPage />} />
              <Route path="courses/new" element={<AdminAddCoursePage />} />
              <Route
                path="courses/edit/:id"
                element={<AdminEditCoursePage />}
              />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="students" element={<AdminStudentsPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
              <Route path="subscribers" element={<AdminSubscribersPage />} />
            </Route>

            {/* 404 */}
            <Route
              path="*"
              element={
                <PublicLayout>
                  <NotFoundPage />
                </PublicLayout>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;