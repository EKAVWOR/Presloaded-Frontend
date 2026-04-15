const Loader = ({ fullScreen = false }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">{spinner}</div>
    );
  }
  return <div className="flex items-center justify-center py-20">{spinner}</div>;
};

export default Loader;