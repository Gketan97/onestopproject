export const MobileHeader = () => {
  return (
    <header className="md:hidden bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 p-4 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={32} />
          <span className="text-xl font-extrabold">
            <span className="font-bold text-white">OneStop</span>
            <span className="font-medium text-gray-300">Careers</span>
          </span>
        </Link>
      </div>
    </header>
  );
};
