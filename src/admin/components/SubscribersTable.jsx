import { formatDate } from "@utils/helpers";

const SubscribersTable = ({ subscribers }) => {
  if (!subscribers?.length) {
    return (
      <p className="text-gray-500 text-center py-10">No subscribers yet</p>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-600">
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((sub, i) => (
            <tr key={sub._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">{i + 1}</td>
              <td className="px-4 py-3 font-medium">{sub.email}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {formatDate(sub.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscribersTable;
