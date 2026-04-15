import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { formatPrice } from "../../../utils/helpers";

const CartSummary = () => {
  const { cartItems, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white rounded-xl border p-6 sticky top-24">
      <h3 className="text-lg font-bold mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span className="text-gray-600 truncate mr-2">{item.title}</span>
            <span className="font-medium whitespace-nowrap">
              {formatPrice(item.discountPrice || item.price)}
            </span>
          </div>
        ))}
      </div>
      <hr className="my-4" />
      <div className="flex justify-between text-lg font-bold mb-6">
        <span>Total</span>
        <span className="text-primary-600">{formatPrice(cartTotal)}</span>
      </div>

      {isAuthenticated ? (
        <Link to="/checkout" className="btn-primary w-full text-center block">
          Proceed to Checkout
        </Link>
      ) : (
        <Link to="/login" state={{ from: { pathname: "/checkout" } }} className="btn-primary w-full text-center block">
          Login to Checkout
        </Link>
      )}

      <Link to="/courses" className="block text-center text-sm text-primary-600 mt-3 hover:underline">
        Continue Browsing
      </Link>
    </div>
  );
};

export default CartSummary;