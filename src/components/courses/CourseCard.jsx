import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatPrice, getDiscountPercent } from "../../../utils/helpers";
import { ELEARNING_URL } from "../../../utils/constants";
import {
  FaClock,
  FaUsers,
  FaMapMarkerAlt,
  FaGlobe,
  FaShoppingCart,
  FaExternalLinkAlt,
} from "react-icons/fa";

const CourseCard = ({ course }) => {
  const { addToCart, isInCart } = useCart();
  const discount = getDiscountPercent(course.price, course.discountPrice);
  const isOffline = course.courseType === "offline";
  const alreadyInCart = isInCart(course._id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <div className="relative">
        <img
          src={course.thumbnail || "https://placehold.co/600x340/4f46e5/white?text=Course"}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${
            isOffline
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isOffline ? "Offline" : "Online"}
        </span>
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full font-medium">
            {course.category}
          </span>
          <span className="text-xs text-gray-400">{course.level}</span>
        </div>

        <Link to={`/courses/${course.slug}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-primary-600 transition line-clamp-2">
            {course.title}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {course.shortDescription}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <FaClock /> {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <FaUsers /> {course.studentsEnrolled || 0}
          </span>
          {isOffline ? (
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt /> {course.location || "On-site"}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <FaGlobe /> E-Learning
            </span>
          )}
        </div>

        {/* Price + Action - pushed to bottom */}
        <div className="mt-auto pt-4 border-t flex items-center justify-between">
          {isOffline ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary-600">
                  {formatPrice(course.discountPrice || course.price)}
                </span>
                {discount > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(course.price)}
                  </span>
                )}
              </div>
              <button
                onClick={() => addToCart(course)}
                disabled={alreadyInCart}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  alreadyInCart
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                <FaShoppingCart size={14} />
                {alreadyInCart ? "In Cart" : "Add to Cart"}
              </button>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-500 font-medium">E-Learning</span>
              <a
                href={course.onlinePlatformUrl || ELEARNING_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Go to Platform <FaExternalLinkAlt size={12} />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;