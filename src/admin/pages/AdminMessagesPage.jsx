import { useState, useEffect } from "react";
import {
  getMessages,
  markMessageRead,
  deleteMessage,
} from "../../services/adminService";
import MessagesTable from "../components/MessagesTable";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const loadMessages = async () => {
    try {
      const params = {};
      if (filter) params.read = filter;

      const { data } = await getMessages(params);
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [filter]);

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: true } : m))
      );
      toast.success("Marked as read");
    } catch (err) {
      toast.error("Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast.success("Message deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <Loader />;

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <p className="text-gray-500 text-sm">
            {unread > 0 ? `${unread} unread messages` : "No unread messages"}
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-40"
        >
          <option value="">All</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      <MessagesTable
        messages={messages}
        onMarkRead={handleMarkRead}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminMessagesPage;