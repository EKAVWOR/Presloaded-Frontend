import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { createOrder, verifyPayment } from "../services/orderService";
import { formatPrice, generateReference } from "../../utils/helpers";
import { PAYSTACK_PUBLIC_KEY } from "../../utils/constants";
import toast from "react-hot-toast";
import { FaLock, FaShieldAlt } from "react-icons/fa";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  // ✅ Reference can be regenerated on retry
  const [reference, setReference] = useState(() => generateReference());

  const paystackConfig = {
    reference,
    email: user?.email || "",
    amount: cartTotal * 100,
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: "Student Name",
          variable_name: "student_name",
          value: user?.name,
        },
        {
          display_name: "Courses",
          variable_name: "courses",
          value: cartItems.map((c) => c.title).join(", "),
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  // ✅ All hooks above — early returns below
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  if (user && !user.isEmailVerified) {
    return (
      <section className="section-padding">
        <div className="container-custom max-w-lg text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-3">Verify Your Email</h2>
            <p className="text-gray-600 mb-4">
              Please verify your email address before making a purchase. Check
              your inbox for the verification link.
            </p>
            <button
              onClick={() => navigate("/dashboard?tab=profile")}
              className="btn-primary"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </section>
    );
  }

  const onSuccess = async (ref) => {
    setProcessing(true);
    try {
      await createOrder({
        courses: cartItems.map((c) => ({
          courseId: c._id,
          title: c.title,
          price: c.discountPrice || c.price,
        })),
        totalAmount: cartTotal,
        paystackReference: ref.reference,
      });

      await verifyPayment(ref.reference);

      clearCart();
      toast.success("Payment successful! Check your email for your admission letter.");
      navigate(`/payment-success?reference=${ref.reference}`);
    } catch (error) {
      // ✅ Fresh reference for next attempt
      setReference(generateReference());

      toast.error(
        error.response?.data?.message ||
          "Payment verification failed. Please contact support."
      );
    } finally {
      setProcessing(false);
    }
  };

  const onClose = () => {
    // ✅ Fresh reference when popup closed
    setReference(generateReference());
    toast.error("Payment cancelled");
  };

  const handlePay = () => {
    if (processing) return; // ✅ Guard against double clicks
    initializePayment({ onSuccess, onClose });
  };

  return (
    <>
      <section className="bg-gradient-to-r from-primary-800 to-primary-600 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Order Summary */}
            <div className="md:col-span-3 space-y-4">
              <h2 className="text-xl font-bold mb-2">Order Summary</h2>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-white border rounded-lg p-4"
                >
                  <img
                    src={
                      item.thumbnail ||
                      "https://placehold.co/100x70/4f46e5/white?text=Course"
                    }
                    alt={item.title}
                    className="w-20 h-14 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.duration} • {item.level}
                    </p>
                  </div>
                  <p className="font-bold text-primary-600">
                    {formatPrice(item.discountPrice || item.price)}
                  </p>
                </div>
              ))}

              {/* Student Info */}
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h3 className="font-semibold mb-2">Student Information</h3>
                <p className="text-sm text-gray-600">Name: {user?.name}</p>
                <p className="text-sm text-gray-600">Email: {user?.email}</p>
                {user?.phone && (
                  <p className="text-sm text-gray-600">Phone: {user?.phone}</p>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="md:col-span-2">
              <div className="bg-white border rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4">Payment</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Subtotal ({cartItems.length} course
                      {cartItems.length > 1 ? "s" : ""})
                    </span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span className="text-primary-600">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaLock size={14} />
                  {processing
                    ? "Processing..."
                    : `Pay ${formatPrice(cartTotal)}`}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                  <FaShieldAlt />
                  <span>Secured by Paystack</span>
                </div>

                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  By completing this purchase you agree to our terms. An
                  admission letter will be sent to your email upon successful
                  payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;