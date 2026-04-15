import { formatDate } from "../../../utils/helpers";
import { FaTrash, FaEnvelopeOpen, FaEnvelope } from "react-icons/fa";

const MessagesTable = ({ messages, onMarkRead, onDelete }) => {
  if (!messages?.length) {
    return <p className="text-gray-500 text-center py-10">No messages</p>;
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`bg-white border rounded-xl p-5 ${
            !msg.isRead ? "border-l-4 border-l-primary-500" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {msg.isRead ? (
                  <FaEnvelopeOpen className="text-gray-400" size={14} />
                ) : (
                  <FaEnvelope className="text-primary-600" size={14} />
                )}
                <h3 className="font-semibold text-gray-800">{msg.subject}</h3>
                {!msg.isRead && (
                  <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                From: <strong>{msg.name}</strong> ({msg.email})
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {msg.message}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDate(msg.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!msg.isRead && (
                <button
                  onClick={() => onMarkRead(msg._id)}
                  className="text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition"
                  title="Mark as read"
                >
                  <FaEnvelopeOpen size={16} />
                </button>
              )}
              <button
                onClick={() => onDelete(msg._id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                title="Delete"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesTable;