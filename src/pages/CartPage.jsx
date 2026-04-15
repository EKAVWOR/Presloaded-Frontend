import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";

const CartPage = () => {
  const { cartItems, clearCart } = useCart();

  return (
    <>
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <FaShoppingCart /> Shopping Cart
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <FaShoppingCart size={60} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Browse our offline courses and add them to your cart.
              </p>
              <Link to="/courses" className="btn-primary inline-flex items-center gap-2">
                <FaArrowLeft /> Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600">
                    {cartItems.length} course{cartItems.length > 1 ? "s" : ""} in cart
                  </p>
                  <button
                    onClick={clearCart}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Clear Cart
                  </button>
                </div>
                {cartItems.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
              <CartSummary />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CartPage;