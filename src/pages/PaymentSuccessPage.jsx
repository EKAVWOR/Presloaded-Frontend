import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../services/orderService";
import Loader from "../components/common/Loader";
import { FaCheckCircle, FaEnvelope, FaDownload } from "react-icons/fa";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        if (reference) {
          const { data } = await verifyPayment(reference);
          setOrder(data.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [reference]);

  if (loading) return <Loader fullScreen />;

  return (
    <section className="section-padding">
      <div className="container-custom max-w-2xl text-center">
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle size={40} className="text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your enrolment. Your admission is being processed.
          </p>

          {reference && (
            <p className="text-sm text-gray-500 mb-6">
              Reference: <span className="font-mono font-semibold">{reference}</span>
            </p>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <FaEnvelope className="text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-green-800">Check your email</p>
                <p className="text-green-700 text-sm">
                  An admission letter and course details have been sent to your email address.
                  Please check your inbox (and spam folder).
                </p>
              </div>
            </div>
          </div>

          {order && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
              <h3 className="font-semibold mb-2">Courses Enrolled</h3>
              {order.courses?.map((c, i) => (
                <p key={i} className="text-sm text-gray-600">✅ {c.title}</p>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/courses" className="btn-secondary">
              Browse More Courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccessPage;