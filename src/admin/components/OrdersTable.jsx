import { formatPrice, formatDate } from "@utils/helpers";

const statusColors = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const OrdersTable = ({ orders }) => {
  if (!orders?.length) {
    return <p className="text-gray-500 text-center py-10">No orders found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-600">
            <th className="px-4 py-3 font-medium">Reference</th>
            <th className="px-4 py-3 font-medium">Student</th>
            <th className="px-4 py-3 font-medium">Courses</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs">
                {order.paystackReference?.substring(0, 16)}...
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{order.user?.name || "—"}</p>
                <p className="text-xs text-gray-500">
                  {order.user?.email || "—"}
                </p>
              </td>
              <td className="px-4 py-3">
                {order.courses?.map((c, i) => (
                  <p key={i} className="text-xs">
                    {c.title}
                  </p>
                ))}
              </td>
              <td className="px-4 py-3 font-semibold">
                {formatPrice(order.totalAmount)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    statusColors[order.paymentStatus] || "bg-gray-100"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {formatDate(order.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
