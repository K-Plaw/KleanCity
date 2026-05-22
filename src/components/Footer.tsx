import React from 'react';
import { Recycle, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

interface FooterProps {
  setView: (view: string) => void;
}

export default function Footer({ setView }: FooterProps) {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing to KleanCity updates!");
  };

  return (
    <footer className="bg-klean-navy text-white/80 py-16 px-6 sm:px-12 border-t border-white/5 font-sans relative z-10" id="app_footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 sm:gap-8">
        
        {/* Logo and Description */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onClick={() => setView('home')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-klean-green/20 flex items-center justify-center text-klean-green">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              Klean<span className="text-klean-green">City</span>
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400 max-w-sm leading-relaxed">
            Making cities cleaner, one pickup at a time. Empowering Lagos households to dispose of waste sustainably and earn loyalty rewards.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-3">
            {[
              { icon: Facebook, label: 'Facebook' },
              { icon: Twitter, label: 'Twitter' },
              { icon: Instagram, label: 'Instagram' },
              { icon: Linkedin, label: 'LinkedIn' }
            ].map((social, i) => (
              <a
                key={i}
                href="#"
                onClick={(e) => { e.preventDefault(); }}
                className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-klean-green hover:text-white flex items-center justify-center text-slate-300 transition-all shadow-md group-hover:scale-105"
                title={social.label}
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Product Columns */}
        <div>
          <h4 className="font-display font-bold text-sm tracking-widest text-white uppercase mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li><a href="#features" className="hover:text-klean-green transition-colors">Features</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-klean-green transition-colors">Pricing</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-klean-green transition-colors">FAQ</a></li>
            <li><a href="#how_it_works" className="hover:text-klean-green transition-colors">How It Works</a></li>
          </ul>
        </div>

        {/* Company Columns */}
        <div>
          <h4 className="font-display font-bold text-sm tracking-widest text-white uppercase mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li><a href="#about_us" className="hover:text-klean-green transition-colors">About Us</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-klean-green transition-colors">Blog</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-klean-green transition-colors">Careers</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-klean-green transition-colors">Press</a></li>
          </ul>
        </div>

        {/* Support and Newsletter */}
        <div className="space-y-6">
          <div>
            <h4 className="font-display font-bold text-sm tracking-widest text-white uppercase mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-klean-green transition-colors">Help Center</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-klean-green transition-colors">Contact Us</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-klean-green transition-colors">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-klean-green transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Stay Updated & Copyright */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-auto">
          <p className="text-sm font-semibold text-white mb-2">Stay Updated</p>
          <p className="text-xs text-slate-400 mb-4 max-w-xs">Subscribe to our newsletter for the latest updates.</p>
          <form onSubmit={handleSubscribe} className="flex max-w-sm rounded-lg overflow-hidden border border-white/10 focus-within:border-klean-green transition-colors font-sans">
            <input 
              type="email" 
              required
              placeholder="Enter your email" 
              className="bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none w-full"
            />
            <button 
              type="submit" 
              className="bg-klean-green hover:bg-klean-green-hover text-white px-5 flex items-center justify-center transition-colors"
              id="footer_newsletter_btn"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
        <p className="text-xs text-slate-500 font-medium text-center md:text-right">
          © {new Date().getFullYear()} KleanCity. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
