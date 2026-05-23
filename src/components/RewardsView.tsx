import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useKleanStore } from '../store/useKleanStore';
import { Award, ShoppingBag, Users, Clipboard, Check, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { RewardVoucher } from '../types';

export default function RewardsView() {
  const { currentUser, redeemVoucher, vouchersRedeemedCount, totalVouchersCount, showToast } = useKleanStore();
  const [activeTab, setActiveTab] = useState<'redeem' | 'referral'>('redeem');
  const [copied, setCopied] = useState(false);
  
  // Voucher details state
  const [recentGeneratedCode, setRecentGeneratedCode] = useState('');
  const [isRedeemSuccessOpen, setIsRedeemSuccessOpen] = useState(false);
  const [justRedeemedTitle, setJustRedeemedTitle] = useState('');

  const vouchers: RewardVoucher[] = [
    { id: 'v_mtn_100', title: '₦100 MTN Airtime', network: 'MTN', pointsCost: 100, type: 'airtime', description: 'Recharge card voucher code for your MTN line.', value: '₦100 Airtime', bgColor: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
    { id: 'v_glo_100', title: '₦100 Glo Airtime', network: 'Glo', pointsCost: 100, type: 'airtime', description: 'Recharge card voucher code for your Glo cellular plan.', value: '₦100 Airtime', bgColor: 'bg-green-50 border-green-200 text-green-800' },
    { id: 'v_airtel_100', title: '₦100 Airtel Airtime', network: 'Airtel', pointsCost: 100, type: 'airtime', description: 'Instant recharge voucher code for Airtel services.', value: '₦100 Airtime', bgColor: 'bg-red-50 border-red-200 text-red-800' },
    { id: 'v_mtn_1gb', title: 'MTN 1GB Data Pin', network: 'MTN', pointsCost: 500, type: 'data', description: 'Get high-speed 1GB internet package voucher pin.', value: '1GB Data Code', bgColor: 'bg-amber-100/70 border-amber-250 text-amber-900' },
    { id: 'v_airtel_2gb', title: 'Airtel 2GB Data Code', network: 'Airtel', pointsCost: 1000, type: 'data', description: 'Stay connected with 2GB super-fast data package voucher.', value: '2GB Data Code', bgColor: 'bg-rose-50 border-rose-200 text-rose-800' }
  ];

  const handleCopyCode = () => {
    const code = currentUser?.referralCode || 'KLEAN2026';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code);
      }
    } catch (err) {}
    setCopied(true);
    showToast(`Referral code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    const code = currentUser?.referralCode || 'KLEAN2026';
    const link = `https://klean-city.vercel.app/invite?ref=${code}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link);
      }
      showToast(`Referral link with code ${code} copied to clipboard!`, 'success');
    } catch (err) {
      showToast(`Referral link: ${link}`, 'info');
    }
  };

  const handleRedeem = (item: RewardVoucher) => {
    if (!currentUser) return;
    
    const didSucceed = redeemVoucher(item.pointsCost);
    if (didSucceed) {
      // Generate a realistic NGN voucher pin
      const randomCode = `${item.network.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10000 + Math.random() * 90000)}`;
      setRecentGeneratedCode(randomCode);
      setJustRedeemedTitle(item.title);
      setIsRedeemSuccessOpen(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8" id="rewards_view_panel">
      
      {/* Title */}
      <div className="text-left mb-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          Rewards Store
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Turn your recycling efforts into airtime, data vouchers, cash coupons, or invite bonuses.
        </p>
      </div>

      {/* Rewards summary indicator cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-[2rem] hover:bg-white/65 hover:scale-[1.01] transition-all flex items-center justify-between text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Your Point Balance</span>
            <p className="font-display font-extrabold text-3xl text-klean-green tracking-tight">
              {currentUser?.points.toLocaleString() || '0'} <span className="text-xs font-bold text-slate-400">PTS</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <Award size={22} className="animate-pulse" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-[2rem] hover:bg-white/65 hover:scale-[1.01] transition-all flex items-center justify-between text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Redeemed Vouchers</span>
            <p className="font-display font-bold text-2xl text-klean-navy tracking-tight">
              {vouchersRedeemedCount} <span className="text-[10px] font-sans text-slate-400">total used</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200">
            <ShoppingBag size={20} />
          </div>
        </div>

        <div className="glass-card p-6 rounded-[2rem] hover:bg-white/65 hover:scale-[1.01] transition-all flex items-center justify-between text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Referrals Gained</span>
            <p className="font-display font-bold text-2xl text-klean-navy tracking-tight">
              {currentUser?.referralsJoined ?? 0} <span className="text-[10px] sm:text-xs text-slate-400">joined</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* Segmented Tabs controls */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('redeem')}
          className={`px-6 py-3 font-semibold text-sm relative transition-all cursor-pointer ${
            activeTab === 'redeem' ? 'text-klean-green' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Redeem Vouchers</span>
          {activeTab === 'redeem' && (
            <motion.div layoutId="rewards_tab_underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-klean-green" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('referral')}
          className={`px-6 py-3 font-semibold text-sm relative transition-all cursor-pointer ${
            activeTab === 'referral' ? 'text-klean-green' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Invite & Earn Points</span>
          {activeTab === 'referral' && (
            <motion.div layoutId="rewards_tab_underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-klean-green" />
          )}
        </button>
      </div>

      {/* Tabs panels */}
      <div className="min-h-[300px]">
        {activeTab === 'redeem' ? (
          
          /* Tab Panel 1: Redeem vouchers */
          <div className="space-y-6">
            <div className="text-left">
              <h3 className="font-display font-bold text-xl text-slate-800">Available Loyalty Rewards</h3>
              <p className="text-xs text-slate-400 mt-0.5">Deduct your points balance to purchase instant gift cards and telecom recharge pins.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {vouchers.map((item) => {
                const canAfford = currentUser ? currentUser.points >= item.pointsCost : false;
                return (
                  <div
                    key={item.id}
                    className={`p-6 rounded-2xl border transition-all flex flex-col justify-between text-left gap-4 bg-white border-slate-200 hover:border-klean-green/20 hover:shadow-md`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${item.bgColor}`}>
                          {item.network} • {item.type}
                        </span>
                        <span className="font-display font-bold text-klean-green text-sm flex items-center gap-1">
                          <Sparkles size={14} />
                          {item.pointsCost} PTS
                        </span>
                      </div>
                      
                      <h4 className="font-display font-bold text-lg text-slate-900 truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400 font-semibold leading-relaxed line-clamp-2">{item.description}</p>
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => handleRedeem(item)}
                      className={`w-full font-bold text-xs py-3 rounded-xl transition-all tracking-wide cursor-pointer flex items-center justify-center gap-1.5 ${
                        canAfford
                          ? 'bg-slate-950 text-white hover:bg-slate-850 shadow-xs'
                          : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Award size={14} />
                      <span>{canAfford ? 'Redeem Voucher' : 'Insufficient Points'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        ) : (
          
          /* Tab Panel 2: Referrals */
          <div className="space-y-6 max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm text-left">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mx-auto mb-2">
                <Users size={28} />
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-900">Invite Friends, Earn rewards</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Get bonus +50 points instantly whenever a friend registers using your custom referral code.</p>
            </div>

            <div className="space-y-4 pt-4">
              {/* Copyable referral box */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-wide">Your Referral Code</label>
                <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden font-mono">
                  <span className="p-3.5 text-base font-extrabold text-slate-800 tracking-widest flex-1 text-center">
                    {currentUser?.referralCode || 'KLEAN2026'}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="bg-slate-950 hover:bg-slate-850 text-white px-5 flex items-center justify-center transition-colors cursor-pointer gap-1.5 font-sans font-bold text-xs"
                  >
                    {copied ? <Check size={14} /> : <Clipboard size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Referral Invite statistics */}
              <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                <div className="bg-slate-50 p-4 border rounded-2xl border-slate-100">
                  <span className="font-display font-bold text-xl text-slate-800">{currentUser?.referralsInvited ?? 0}</span>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mt-1">Invited</span>
                </div>
                <div className="bg-slate-50 p-4 border rounded-2xl border-slate-100">
                  <span className="font-display font-bold text-xl text-slate-800">{currentUser?.referralsJoined ?? 0}</span>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mt-1">Joined</span>
                </div>
                <div className="bg-emerald-50/50 p-4 border rounded-2xl border-emerald-100">
                  <span className="font-display font-bold text-xl text-emerald-600">{currentUser?.referralsPointsEarned ?? 0}</span>
                  <span className="block text-[10px] text-emerald-600 font-bold uppercase mt-1">PTS Gained</span>
                </div>
              </div>

              <button
                onClick={handleShareLink}
                className="w-full bg-slate-950 hover:bg-slate-850 text-white font-bold py-3 px-4 rounded-xl shadow-xs transition-transform active:scale-98 text-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Share Referral Link</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Redemption success overlays / drawer dialog modal */}
      <AnimatePresence>
        {isRedeemSuccessOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[100]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl relative text-center space-y-6"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Check size={28} />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-2xl text-slate-900">Purchase Successful!</h3>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">{justRedeemedTitle}</span>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed pt-2">
                  Use the generated recharge code below to claim your benefits immediately. This code has also been sent to your email.
                </p>
              </div>

              {/* Pin Code Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono font-bold text-lg text-slate-800 tracking-wider relative flex items-center justify-center group overflow-hidden">
                <span>{recentGeneratedCode}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopyCode}
                  className="bg-slate-50 border hover:bg-slate-100 text-slate-800 font-bold py-3 text-xs rounded-xl flex-1 cursor-pointer flex items-center justify-center gap-1"
                >
                  {copied ? <Check size={14} /> : <Clipboard size={14} />}
                  <span>{copied ? 'Copied' : 'Copy Voucher'}</span>
                </button>
                <button
                  onClick={() => setIsRedeemSuccessOpen(false)}
                  className="bg-slate-950 hover:bg-slate-850 text-white font-bold py-3 text-xs rounded-xl flex-1 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
