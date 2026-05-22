import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Recycle, Bell, LogOut, Menu, X } from 'lucide-react';
import { useKleanStore } from '../store/useKleanStore';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

export default function Navbar({ currentView, setView }: NavbarProps) {
  const { currentUser, logout } = useKleanStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (view: string) => {
    setView(view);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setView('home');
    setMobileOpen(false);
  };

  const isUserLoggedIn = !!currentUser;
  const isLandingPage = currentView === 'home';

  return (
    <nav className="sticky top-0 z-50 glass-navbar px-4 sm:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between font-sans">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick(isUserLoggedIn ? 'dashboard' : 'home')} 
          className="flex items-center gap-2 cursor-pointer group"
          id="nav_brand_logo"
        >
          <div className="w-10 h-10 rounded-xl bg-klean-green/10 flex items-center justify-center text-klean-green group-hover:scale-105 transition-transform">
            <Recycle className="w-6 h-6 animate-spin-slow" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-klean-navy flex items-center">
            Klean<span className="text-klean-green">City</span>
          </span>
        </div>

        {/* Dynamic Navigation Links based on Current View and Auth status */}
        {isLandingPage ? (
          /* Landing Page: features and how it works ONLY */
          <div className="hidden md:flex items-center gap-8 font-sans font-medium text-sm text-slate-600">
            <a href="#features" className="hover:text-klean-green transition-colors font-semibold">features</a>
            <a href="#how_it_works" className="hover:text-klean-green transition-colors font-semibold">how it works</a>
          </div>
        ) : (
          /* Non-landing pages: all other pages */
          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-sans font-medium text-sm text-slate-600">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'schedule', label: 'Schedule' },
              { id: 'map', label: 'Recycle Map' },
              { id: 'rewards', label: 'Rewards' },
              { id: 'wallet', label: 'Wallet' },
              { id: 'disputes', label: 'Disputes' }
            ].map((item) => {
              // Only permit viewing of Dashboard when logged out
              if (!isUserLoggedIn && item.id !== 'dashboard') return null;
              
              const isActive = currentView === item.id || (item.id === 'schedule' && currentView.startsWith('schedule'));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`hover:text-klean-green transition-colors relative py-1 ${
                    isActive ? 'text-klean-green font-semibold' : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div layoutId="nav_underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-klean-green animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Right side controls (Action Buttons or User Profile) */}
        <div className="hidden md:flex items-center gap-3">
          {isLandingPage ? (
            /* Only Sign in and Get Started for the Landing Page */
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView('login')}
                className="text-sm font-semibold text-slate-700 hover:text-klean-navy py-2 px-4 transition-colors cursor-pointer"
                id="btn_signin_nav"
              >
                Sign in
              </button>
              <button 
                onClick={() => setView('register')}
                className="bg-klean-green text-sm hover:bg-klean-green-hover text-white font-semibold py-2.5 px-5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                id="btn_getstarted_nav"
              >
                Get Started
              </button>
            </div>
          ) : !isUserLoggedIn ? (
            /* Guest user outside landing page */
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView('login')}
                className="text-sm font-semibold text-slate-700 hover:text-klean-navy py-2 px-4 transition-colors cursor-pointer"
                id="btn_login_nav"
              >
                Log In
              </button>
              <button 
                onClick={() => setView('register')}
                className="bg-klean-green text-sm hover:bg-klean-green-hover text-white font-semibold py-2.5 px-5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                id="btn_signup_nav"
              >
                Sign Up
              </button>
            </div>
          ) : (
            /* Logged in user */
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative p-2 rounded-full cursor-pointer hover:bg-slate-100 text-slate-500 hover:text-klean-navy transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-ping" />
              </div>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3 md:pl-4">
                <button 
                  onClick={() => setView('dashboard')}
                  className="hidden sm:flex flex-col items-end text-right hover:text-klean-green transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-800">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                  <span className="text-[10px] text-klean-green font-mono tracking-tight font-semibold">
                    {currentUser.points.toLocaleString()} PTS
                  </span>
                </button>
                <div 
                  onClick={() => setView('dashboard')}
                  className="w-9 h-9 rounded-full bg-klean-green/10 text-klean-green flex items-center justify-center font-bold text-sm shadow-xs border border-klean-green/20 cursor-pointer"
                >
                  {currentUser.firstName[0]}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50/50 transition-all ml-1"
                  title="Log Out"
                  id="navbar_logout_trigger"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          {/* If logged in on other views, still show notification dot or profile initials */}
          {isUserLoggedIn && !isLandingPage && (
            <div 
              onClick={() => handleNavClick('dashboard')}
              className="w-8 h-8 rounded-full bg-klean-green/10 text-klean-green flex items-center justify-center font-bold text-xs border border-klean-green/20 mr-1"
            >
              {currentUser.firstName[0]}
            </div>
          )}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-white/50 border border-white text-slate-700 hover:text-klean-green transition-colors"
            id="mobile_menu_toggle"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-slate-200/50 flex flex-col gap-4 text-left font-sans"
            id="mobile_menu_drawer"
          >
            {isLandingPage ? (
              <>
                <a 
                  href="#features" 
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2 hover:bg-white/55 rounded-xl text-sm font-semibold text-slate-700 transition-colors"
                >
                  features
                </a>
                <a 
                  href="#how_it_works" 
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2 hover:bg-white/55 rounded-xl text-sm font-semibold text-slate-700 transition-colors"
                >
                  how it works
                </a>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handleNavClick('login')}
                    className="w-full text-center py-2.5 text-sm font-bold text-slate-700 bg-white/40 border border-white rounded-full transition-colors"
                  >
                    Sign in
                  </button>
                  <button 
                    onClick={() => handleNavClick('register')}
                    className="w-full text-center py-2.5 text-sm font-bold text-white bg-klean-green rounded-full transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </>
            ) : (
              <>
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'schedule', label: 'Schedule' },
                  { id: 'map', label: 'Recycle Map' },
                  { id: 'rewards', label: 'Rewards' },
                  { id: 'wallet', label: 'Wallet' },
                  { id: 'disputes', label: 'Disputes' }
                ].map((item) => {
                  if (!isUserLoggedIn && item.id !== 'dashboard') return null;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`px-4 py-2 hover:bg-white/55 text-left rounded-xl text-sm font-semibold transition-all ${
                        currentView === item.id ? 'text-klean-green bg-white/60' : 'text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}

                <div className="border-t border-slate-200/50 pt-4 flex flex-col gap-3">
                  {!isUserLoggedIn ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleNavClick('login')}
                        className="w-full text-center py-2.5 text-sm font-bold text-slate-700 bg-white/40 border border-white rounded-full"
                      >
                        Log In
                      </button>
                      <button 
                        onClick={() => handleNavClick('register')}
                        className="w-full text-center py-2.5 text-sm font-bold text-white bg-klean-green rounded-full"
                      >
                        Sign Up
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{currentUser.firstName} {currentUser.lastName}</span>
                        <span className="text-[10px] text-klean-green font-mono font-bold mt-0.5">{currentUser.points.toLocaleString()} PTS</span>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50/50 rounded-xl transition-colors border border-red-100/30"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}
