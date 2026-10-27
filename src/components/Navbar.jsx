import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import InfinitySymbol from '../assets/InfinitySymbol.jsx';
import { Ticket, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Screenings', path: '/movies' },
    { label: 'Genres', path: '/movies?tab=categories' },
    { label: 'Now Showing', path: '/movies?tab=available' },
    { label: 'Concierge', path: '/help' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05030f]/90 backdrop-blur-md border-b border-indigo-500/25 py-3.5 shadow-[0_4px_30px_rgba(79,107,255,0.15)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white group whitespace-nowrap shrink-0"
        >
          <InfinitySymbol className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" animated={true} />
          <span className="font-display font-black text-lg tracking-widest uppercase bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_15px_rgba(79,107,255,0.8)] transition-all">
            Infinity <span className="text-cyan-400 font-light">Cinema</span>
          </span>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) =>
                `text-xs uppercase tracking-wider font-display font-semibold transition-all relative py-1 whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-300 font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                    : 'text-slate-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full shadow-[0_0_10px_#4f6bff]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Primary Action / User */}
        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 hover:border-cyan-400/50 text-slate-200 transition-all text-xs font-display"
                aria-label="User profile menu"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-[0_0_8px_#4f6bff]">
                  {user.name.charAt(0)}
                </div>
                <span className="font-medium max-w-[110px] truncate hidden sm:inline">
                  {user.name}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl glass-panel-glow py-2 border border-indigo-500/30 shadow-2xl z-50">
                  <div className="px-4 py-2 border-b border-indigo-500/20">
                    <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-display">Void Traveler</p>
                    <p className="text-xs font-semibold text-slate-100 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/my-bookings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-indigo-600/20 hover:text-cyan-300 transition-colors"
                  >
                    <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                    My Void Tickets
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-cyan-300 transition-colors font-display uppercase tracking-wider"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-bold text-white btn-electric rounded-lg transition-transform hover:scale-105 font-display uppercase tracking-wider shadow-[0_0_20px_rgba(79,107,255,0.4)]"
              >
                Join Void
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090e] border-b border-white/10 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs uppercase tracking-wider text-slate-300 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs uppercase tracking-wider text-slate-300 hover:text-white"
            >
              My Tickets
            </Link>
          )}
          {!user && (
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs text-slate-300"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg text-center"
              >
                Join Membership
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
