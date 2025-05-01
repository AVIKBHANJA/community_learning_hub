import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCredits } from "../../contexts/CreditContext";

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { credits } = useCredits();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when location changes
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-primary-500/20">
              LH
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent hidden sm:inline-block">
              Learning Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" active={isActive("/")}>
              Home
            </NavLink>
            <NavLink to="/learning-paths" active={isActive("/learning-paths")}>
              Learning Paths
            </NavLink>
            <NavLink to="/forum" active={isActive("/forum")}>
              Forum
            </NavLink>
            <NavLink to="/feed" active={isActive("/feed")}>
              Feed
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/achievements" active={isActive("/achievements")}>
                  Achievements
                </NavLink>
                <NavLink to="/marketplace" active={isActive("/marketplace")}>
                  Marketplace
                </NavLink>
              </>
            )}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Credits display for logged in users */}
            {isAuthenticated && (
              <div className="hidden sm:flex items-center px-3 py-1.5 bg-gradient-to-r from-secondary-100 to-primary-100 rounded-full border border-secondary-200">
                <svg
                  className="h-5 w-5 text-primary-500 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Link
                  to="/credits"
                  className="text-sm font-medium text-primary-800 hover:text-primary-900"
                >
                  {credits} Credits
                </Link>
              </div>
            )}

            {/* Authenticated user dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-medium text-sm uppercase shadow-sm">
                    {user?.firstName?.charAt(0) || "U"}
                    {user?.lastName?.charAt(0) || ""}
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                    <div className="py-1">
                      <DropdownLink to="/profile">
                        <svg
                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        My Profile
                      </DropdownLink>
                      <DropdownLink to="/credits">
                        <svg
                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        My Credits
                      </DropdownLink>
                    </div>

                    {user?.isAdmin && (
                      <div className="py-1 border-t border-gray-100">
                        <DropdownLink to="/admin">
                          <svg
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Admin Dashboard
                        </DropdownLink>
                      </div>
                    )}

                    <div className="py-1 border-t border-gray-100">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 group flex items-center"
                      >
                        <svg
                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors py-2 px-3 rounded-lg"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors py-2 px-4 rounded-lg shadow-sm hover:shadow-md"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-5 space-y-1 bg-gray-50 border-b border-gray-200">
          <MobileNavLink to="/" active={isActive("/")}>
            Home
          </MobileNavLink>
          <MobileNavLink
            to="/learning-paths"
            active={isActive("/learning-paths")}
          >
            Learning Paths
          </MobileNavLink>
          <MobileNavLink to="/forum" active={isActive("/forum")}>
            Forum
          </MobileNavLink>
          <MobileNavLink to="/feed" active={isActive("/feed")}>
            Feed
          </MobileNavLink>
          {isAuthenticated && (
            <>
              <MobileNavLink
                to="/achievements"
                active={isActive("/achievements")}
              >
                Achievements
              </MobileNavLink>
              <MobileNavLink
                to="/marketplace"
                active={isActive("/marketplace")}
              >
                Marketplace
              </MobileNavLink>
              <MobileNavLink to="/profile" active={isActive("/profile")}>
                My Profile
              </MobileNavLink>
              <MobileNavLink to="/credits" active={isActive("/credits")}>
                <span className="flex items-center">
                  <svg
                    className="h-5 w-5 text-primary-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Credits: {credits}
                </span>
              </MobileNavLink>
              {user?.isAdmin && (
                <MobileNavLink to="/admin" active={isActive("/admin")}>
                  Admin Dashboard
                </MobileNavLink>
              )}
              <div className="pt-2 border-t border-gray-200 mt-2">
                <button
                  onClick={logout}
                  className="w-full text-left block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-700 hover:bg-gray-100 rounded-md"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
          {!isAuthenticated && (
            <div className="pt-2 border-t border-gray-200 mt-2 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="py-2 px-3 bg-white shadow-sm border border-gray-200 rounded-lg text-center text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="py-2 px-3 bg-primary-600 rounded-lg text-center text-sm font-medium text-white hover:bg-primary-700 shadow-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Desktop navigation link
const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-primary-50 text-primary-700"
        : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
    }`}
  >
    {children}
  </Link>
);

// Mobile navigation link
const MobileNavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`block px-3 py-2 text-base font-medium rounded-md ${
      active
        ? "bg-gray-100 text-primary-700"
        : "text-gray-600 hover:text-primary-700 hover:bg-gray-100"
    }`}
  >
    {children}
  </Link>
);

// Dropdown link component
const DropdownLink = ({ to, children }) => (
  <Link
    to={to}
    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 group flex items-center"
  >
    {children}
  </Link>
);

export default Navbar;
