import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="bg-white border-b px-4 py-4">
          <h1 className="text-lg font-bold">🏆 World Cup Sweepstake</h1>
          <p className="text-xs text-gray-500">Family Draw Dashboard</p>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4">
          {children}
        </main>

        {/* NAV (SAFE VERSION) */}
        <footer className="bg-white border-t flex justify-around py-3 text-sm">

          <Link
            to="/"
            className={isActive("/") ? "text-purple-600 font-semibold" : "text-gray-500"}
          >
            Home
          </Link>

          <Link
            to="/fixtures"
            className={isActive("/fixtures") ? "text-purple-600 font-semibold" : "text-gray-500"}
          >
            Fixtures
          </Link>

          <Link
            to="/teams"
            className={isActive("/teams") ? "text-purple-600 font-semibold" : "text-gray-500"}
          >
            Teams
          </Link>
        </footer>

      </div>
    </div>
  );
}