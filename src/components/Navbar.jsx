import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-bold text-white hover:text-purple-300 transition-all transform hover:scale-105"
          >
            ✨ Shayari Card Maker
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
               Home
            </Link>
            <Link
              to="/create"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                isActive('/create')
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
               Create
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                isActive('/about')
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
               About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/20 transition-all"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                isActive('/')
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
               Home
            </Link>
            <Link
              to="/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                isActive('/create')
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
               Create
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                isActive('/about')
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
               About
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;