import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useKleanStore } from './store/useKleanStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import DashboardView from './components/DashboardView';
import SchedulePickupView from './components/SchedulePickupView';
import RewardsView from './components/RewardsView';
import WalletView from './components/WalletView';
import DisputesView from './components/DisputesView';
import RecycleMapView from './components/RecycleMapView';
import FloatingEco from './components/FloatingEco';
import { AlertCircle, X, MapPin, LogOut } from 'lucide-react';

export default function App() {
  const { currentUser, toast, hideToast, showLogoutConfirm, setShowLogoutConfirm, logout } = useKleanStore();
  const [view, setView] = useState(currentUser ? 'dashboard' : 'home');

  // Watch protected states
  useEffect(() => {
    // All pages ought to be auth protected. Only the dashboard page should be without auth protection.
    // If user is logged out, and we are in protected view, redirect to login page
    const protectedViews = ['schedule', 'rewards', 'wallet', 'disputes', 'map'];
    if (!currentUser && protectedViews.includes(view)) {
      setView('login');
    }
  }, [currentUser, view]);

  // If user is logged in and is in an authentication view, auto-redirect to dashboard
  useEffect(() => {
    if (currentUser && (view === 'login' || view === 'register')) {
      setView('dashboard');
    }
  }, [currentUser, view]);

  // Smooth scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  // Render the requested active tab pane
  const renderViewContent = () => {
    switch (view) {
      case 'home':
        return <LandingPage setView={setView} />;
      case 'login':
        return <AuthForm type="login" setView={setView} />;
      case 'register':
        return <AuthForm type="register" setView={setView} />;
      
      // Protected Dashboard views
      case 'dashboard':
        return <DashboardView setView={setView} />;
      case 'schedule':
        return <SchedulePickupView setView={setView} />;
      case 'rewards':
        return <RewardsView />;
      case 'wallet':
        return <WalletView />;
      case 'disputes':
        return <DisputesView />;
      case 'map':
        return <RecycleMapView />;
      default:
        return <LandingPage setView={setView} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent flex flex-col justify-between">
      
      {/* Background Floating decorations */}
      <FloatingEco />

      {/* Persistent App Header */}
      <Navbar currentView={view} setView={setView} />

      {/* Main Container switching views with Framer Motion transitions */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            {renderViewContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Secondary Quick Map Access Action Pill (only when logged in) */}
      {currentUser && view !== 'map' && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setView('map')}
          className="fixed bottom-6 right-6 z-40 bg-klean-green hover:bg-klean-green-hover text-white font-bold py-3 px-5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-1.5 font-sans text-xs border border-white/10"
          id="floating_map_trigger_btn"
        >
          <MapPin size={16} />
          <span>Lagos Recycle Map</span>
        </motion.button>
      )}

      {/* Unified Eco-Footer */}
      <Footer setView={setView} />

      {/* Global Interactive Notification Toast Alerts */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full font-sans"
          >
            <div className={`p-4 rounded-2xl border shadow-xl flex items-start gap-3 text-left ${
              toast.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : toast.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-800'
            }`}>
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-xs font-semibold">{toast.message}</p>
              </div>
              <button 
                onClick={hideToast}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Root-Level Logout Confirmation Dialog Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.99 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-150 shadow-2xl relative text-center space-y-5 my-auto"
            >
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <LogOut size={22} />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-display font-medium text-xl text-slate-900">Are you sure you want to sign out?</h3>
                <p className="text-xs text-slate-400">
                  You will need to sign back in to schedule pickups, verify disputes, or buy reward airtime/data codes.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 text-xs rounded-xl flex-1 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    logout();
                    setView('home');
                    setShowLogoutConfirm(false);
                  }}
                  className="bg-red-650 hover:bg-red-750 text-white font-bold py-3 text-xs rounded-xl flex-1 cursor-pointer transition-all"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
