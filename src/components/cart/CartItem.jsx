import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../../utils/helpers";
import { FaTrash } from "react-icons/fa";

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border p-4 hover:shadow-sm transition">
      <img
        src={item.thumbnail || "https://placehold.co/120x80/4f46e5/white?text=Course"}
        alt={item.title}
        className="w-24 h-16 md:w-32 md:h-20 object-cover rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <Link
          to={`/courses/${item.slug}`}
          className="font-semibold text-gray-800 hover:text-primary-600 transition line-clamp-1"
        >
          {item.title}
        </Link>
        <p className="text-sm text-gray-500">{item.category} • {item.duration}</p>
      </div>
      <div className="text-right flex flex-col items-end gap-2">
        <p className="font-bold text-primary-600">
          {formatPrice(item.discountPrice || item.price)}
        </p>
        <button
          onClick={() => removeFromCart(item._id)}
          className="text-red-500 hover:text-red-700 transition p-1"
          title="Remove"
        >
          <FaTrash size={14} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;