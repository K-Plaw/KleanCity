import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useKleanStore } from '../store/useKleanStore';
import { Recycle, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
  setView: (view: string) => void;
}

export default function AuthForm({ type, setView }: AuthFormProps) {
  const { login, signup } = useKleanStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Field-level initial validations
    if (type === 'register') {
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        // EXACT VALIDATION MESSAGE SPECIFIED: "Please fill in necessary fields."
        setErrorMsg('Please fill in necessary fields.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    } else {
      if (!email || !password) {
        // EXACT VALIDATION MESSAGE SPECIFIED: "Please fill in necessary fields."
        setErrorMsg('Please fill in necessary fields.');
        return;
      }
    }

    setIsLoading(true);

    // Run real async Firebase auth operations and handle status transition
    (async () => {
      try {
        if (type === 'register') {
          const success = await signup(firstName, lastName, email, password);
          if (success) {
            setView('dashboard');
          }
        } else {
          const success = await login(email, password);
          if (success) {
            setView('dashboard');
          }
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Authentication error.');
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 relative" id="auth_container">
      {/* Background decoration blur */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-linear-to-tr from-pink-200/50 to-emerald-200/50 filter blur-3xl -z-10 animate-pulse" />

      {/* Brand logo header on top */}
      <div 
        onClick={() => setView('home')} 
        className="flex items-center gap-2 mb-8 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-klean-navy text-white flex items-center justify-center">
          <Recycle className="w-6 h-6 animate-spin-slow text-klean-green" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight text-klean-navy">
          KleanCity
        </span>
      </div>

      {/* Main card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card rounded-[2.5rem] p-8 shadow-xl"
      >
        <div className="text-left mb-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            {type === 'register' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {type === 'register' 
              ? 'Join KleanCity and start making a difference' 
              : 'Sign in to your KleanCity account'}
          </p>
        </div>

        {/* Validation Errors banner */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Double column for register first/last name */}
          {type === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-klean-navy/30 rounded-xl text-sm focus:outline-none focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-klean-navy/30 rounded-xl text-sm focus:outline-none focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-klean-navy/30 rounded-xl text-sm focus:outline-none focus:bg-white transition-all text-slate-800 font-medium"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5 text-left relative">
            <label className="text-xs font-bold text-slate-700 tracking-wide uppercase flex justify-between items-center">
              <span>Password</span>
              {type === 'login' && (
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Verification check: For demo purposes, simply login with any credentials!"); }} className="text-[10px] text-klean-green hover:underline">Forgot password?</a>
              )}
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********" 
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-klean-navy/30 rounded-xl text-sm focus:outline-none focus:bg-white transition-all text-slate-800 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {type === 'register' && (
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-klean-navy/30 rounded-xl text-sm focus:outline-none focus:bg-white transition-all text-slate-800 font-medium"
              />
            </div>
          )}

          {/* Remember Me box (only for login) */}
          {type === 'login' && (
            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded-xs border-slate-300 text-klean-green focus:ring-klean-green" />
                <span>Remember me</span>
              </label>
            </div>
          )}

          {/* Primary Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-950 hover:bg-slate-900 border border-transparent disabled:bg-slate-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-98 tracking-wide cursor-pointer text-sm flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <span>{type === 'register' ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>

        </form>

        {/* Auth redirection link */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <span className="text-xs font-semibold text-slate-500">
            {type === 'register' ? 'Already have an account? ' : 'Don\'t have an account? '}
          </span>
          <button
            onClick={() => {
              setErrorMsg('');
              setView(type === 'register' ? 'login' : 'register');
            }}
            className="text-xs font-bold text-klean-green hover:underline cursor-pointer"
          >
            {type === 'register' ? 'Sign in' : 'Sign up'}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
