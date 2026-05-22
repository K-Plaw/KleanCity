import { motion } from 'motion/react';
import { ArrowRight, Play, Calendar, ShieldCheck, Gift, Leaf, Recycle, Users, MapPin, Sparkles } from 'lucide-react';

interface LandingPageProps {
  setView: (view: string) => void;
}

export default function LandingPage({ setView }: LandingPageProps) {
  const stats = [
    { value: '50K+', label: 'Active Users', desc: 'Growing community making a difference', icon: Users },
    { value: '2M kg', label: 'Waste Recycled', desc: 'Total recyclable waste properly managed', icon: Recycle, highlight: true },
    { value: '15+', label: 'Cities Served', desc: 'Expanding across cities for a cleaner future', icon: MapPin }
  ];

  const steps = [
    {
      num: '01',
      title: 'Schedule Pickup',
      desc: 'Choose your preferred date and time that works for you.',
      icon: Calendar,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      num: '02',
      title: 'Sort Your Waste',
      desc: 'Separate recyclables from general waste with ease.',
      icon: Recycle,
      color: 'bg-teal-100 text-teal-600'
    },
    {
      num: '03',
      title: 'Track Impact',
      desc: 'Monitor your environmental contribution in real-time on your dashboard.',
      icon: Leaf,
      color: 'bg-green-100 text-green-600'
    },
    {
      num: '04',
      title: 'Earn Rewards',
      desc: 'Get points for responsible waste management and unlock exciting rewards.',
      icon: Gift,
      color: 'bg-rose-100 text-rose-600'
    }
  ];

  return (
    <div className="relative font-sans text-klean-navy overflow-hidden" id="landing-page">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] bg-linear-to-b from-klean-bg via-purple-50/20 to-white px-6 sm:px-12 flex items-center pt-10 pb-16 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 relative z-10 text-left">
            {/* Pill Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800"
            >
              <Leaf size={14} className="animate-pulse" />
              <span>Sustainable Waste Management</span>
            </motion.div>

            {/* Display Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]"
            >
              Cleaner Cities,<br />
              <span className="text-klean-green relative inline-block">
                Smarter
                <span className="absolute bottom-1.5 left-0 w-full h-2 bg-klean-green/10 -z-10 rounded-xs" />
              </span> Waste Pickup.
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 max-w-xl font-medium leading-relaxed"
            >
              Schedule pickups, track recycling progress, and earn rewards for maintaining a cleaner environment. Join Lagos households leading the climate-tech movement.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button 
                onClick={() => setView('register')}
                className="bg-klean-navy text-white hover:bg-slate-800 font-semibold px-8 py-4 rounded-full flex items-center gap-2 shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                id="btn_get_started_hero"
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </button>
              <a 
                href="#how_it_works"
                className="bg-white text-slate-800 border border-slate-200 hover:border-slate-300 font-semibold px-8 py-4 rounded-full flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Learn More</span>
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <Play size={10} className="fill-current ml-0.5" />
                </div>
              </a>
            </motion.div>

            {/* Micro Props Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 pt-4"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-klean-green" />
                <span>Easy Scheduling</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-klean-green" />
                <span>Real-time Tracking</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-klean-green" />
                <span>Reward System</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Right: Highly Polished Premium Climate-Tech Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Soft pink ambient lighting card decoration behind */}
            <div className="absolute w-[360px] h-[360px] rounded-full bg-pink-100/50 saturate-150 blur-3xl -z-10" />

            {/* CSS Rendered Eco Binisolation Frame Wrapper */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full max-w-[380px] glass-panel rounded-3xl p-6 shadow-2xl relative z-10 overflow-hidden group"
            >
              
              {/* Spinning/pulsing environment shine indicators */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl" />
              
              {/* Premium Green Recycle Container Image/CSS Graphic */}
              <div className="w-full aspect-square relative rounded-2xl bg-linear-to-b from-emerald-50 to-green-100/60 p-4 flex flex-col justify-between overflow-hidden">
                
                {/* Float Elements inside the graphic box */}
                <span className="self-end bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-klean-green shadow-sm flex items-center gap-1">
                  <Sparkles size={10} className="animate-spin-slow" />
                  <span>PREMIUM TECH</span>
                </span>

                {/* Styled Bin container */}
                <div className="flex-1 flex items-center justify-center relative">
                  
                  {/* Floating Eco icons */}
                  <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-2 left-6 bg-yellow-100/90 text-yellow-600 p-2 rounded-2xl shadow-md text-xs font-bold"
                  >
                    <Gift size={20} className="fill-current/10" />
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-4 right-2 bg-emerald-100/90 text-emerald-600 p-2 rounded-full shadow-md"
                  >
                    <Leaf size={18} className="fill-current" />
                  </motion.div>

                  {/* Gorgeous Vector Drawing of a Recycle Bin */}
                  <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-lg">
                    {/* Bottle/Can contents in the trash bin */}
                    <path d="M75 55 L85 20 H98 L98 55 Z" fill="#81c784" opacity="0.9" />
                    <circle cx="86" cy="35" r="5" fill="#a5d6a7" />
                    <rect x="105" y="25" width="22" height="35" rx="3" fill="#90caf9" opacity="0.8" />
                    <ellipse cx="116" cy="25" rx="11" ry="5" fill="#e3f2fd" />
                    {/* Metal can */}
                    <rect x="68" y="38" width="18" height="22" rx="2" fill="#cfd8dc" opacity="0.9" />
                    <ellipse cx="77" cy="38" rx="9" ry="3" fill="#eceff1" />

                    {/* Plastic bin body */}
                    <path d="M50 60 L150 60 L140 170 H60 Z" fill="#00a859" />
                    {/* Rim top */}
                    <rect x="42" y="52" width="116" height="10" rx="3" fill="#008744" />
                    {/* Shading */}
                    <path d="M140 60 L132 170 H65 L57 60 Z" fill="#008744" opacity="0.1" />

                    {/* Bold central white Recycle Icon */}
                    <g transform="translate(75, 80) scale(0.25)" fill="#ffffff">
                      <path d="M96 0C88 0 81 5 78 12L3 142C-1 149 -1 158 3 165L41 231C45 238 52 242 60 242H210C218 242 225 238 229 231L267 165C271 158 271 149 267 142L192 12C189 5 182 0 174 0H96ZM135 45L180 123H150C150 148 135 173 112 184C122 171 127 155 127 138C127 114 113 93 92 84L135 45ZM92 99C104 105 111 117 111 130C111 149 96 164 77 164C64 164 53 157 47 146L75 99H92ZM185 142L220 203H145C136 198 129 191 124 182C130 185 137 186 144 186C163 186 180 172 184 153L185 142Z" />
                    </g>
                  </svg>
                </div>

                {/* Live Activity Floating Row */}
                <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-xs border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-800">Lagos Island Pickup</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 sm:px-12 bg-white relative z-10" id="how_it_works">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Header Texts */}
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-klean-green uppercase">How It Works</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Simple Steps, <span className="text-klean-green">Big Impact</span>
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Join the movement in just four easy steps.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-linear-to-b from-slate-50 to-slate-100/50 hover:from-white hover:to-white p-6 rounded-2xl border border-slate-200/60 hover:border-klean-green/20 hover:shadow-xl hover:-translate-y-1 transition-all text-left relative overflow-hidden group"
                >
                  {/* Floating Number Label */}
                  <span className="absolute top-4 right-6 font-mono text-4xl font-light text-slate-200 group-hover:text-klean-green/10 transition-colors">
                    {step.num}
                  </span>

                  {/* Icon Frame */}
                  <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-6 shadow-xs`}>
                    <IconComp size={24} />
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-semibold text-lg text-slate-900 mb-2 truncate">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                    {step.desc}
                  </p>
                  
                  {/* Bottom Indicator accent line */}
                  <div className="h-1.5 w-8 bg-klean-green/10 group-hover:bg-klean-green rounded-full transition-all" />

                  {/* Arrow connectors between steps (only on large desktop) */}
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-[28%] -right-4 translate-x-1.5 text-slate-300 z-20">
                      →
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Premium Stats Grid Section */}
      <section className="py-12 bg-white px-6 sm:px-12 relative z-10" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
            
            {/* Background elements inside the card */}
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative z-10 items-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              
              {stats.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div key={idx} className="flex items-center gap-6 py-6 md:py-0 md:px-8 first:pl-0 last:pr-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      stat.highlight ? 'bg-klean-green text-white' : 'bg-slate-800 text-klean-green'
                    } shadow-md`}>
                      <StatIcon size={24} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                        {stat.value}
                      </h3>
                      <p className="text-xs font-semibold uppercase tracking-wider text-klean-green mt-1">
                        {stat.label}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {stat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-20 bg-linear-to-b from-white to-klean-bg px-6 sm:px-12 relative z-10 text-center" id="about_us">
        <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-10 sm:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          {/* Animated decorative leaves / recycle marks */}
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />

          {/* CTA Content */}
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-klean-green uppercase">Join the Movement</span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
              Ready to Make a <span className="text-klean-green">Difference?</span>
            </h2>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              Join thousands of Lagos residents making their cities cleaner, one waste bag and recycled plastic at a time. Earn rewards while doing good.
            </p>
            
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setView('register')}
                className="bg-klean-green hover:bg-klean-green-hover text-white font-semibold px-8 py-4 rounded-full flex items-center gap-2 shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer text-sm"
                id="btn_get_started_cta"
              >
                <span>Get Started Today</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
