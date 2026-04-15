import { useAuth } from "../../hooks/useAuth";

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="md:hidden w-8" />
      <h3 className="text-gray-500 text-sm hidden md:block">
        Welcome back, <span className="font-semibold text-gray-800">{user?.name}</span>
      </h3>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-primary-600 font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;