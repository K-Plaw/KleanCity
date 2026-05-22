import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useKleanStore } from '../store/useKleanStore';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Plus, Trash2, Check, Sparkles, AlertCircle } from 'lucide-react';
import { SavedCard, WalletTransaction } from '../types';

export default function WalletView() {
  const { currentUser, transactions, fundWallet, addCard, removeCard, showToast } = useKleanStore();
  const [activeTab, setActiveTab] = useState<'fund' | 'cards' | 'history'>('fund');
  
  // Wallet fund states
  const [fundingAmount, setFundingAmount] = useState('');
  const [isFundingSuccessOpen, setIsFundingSuccessOpen] = useState(false);
  const [justFundedAmount, setJustFundedAmount] = useState(0);

  // Added card states
  const [newCardBrand, setNewCardBrand] = useState<'Visa' | 'Mastercard'>('Visa');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const handleQuickFund = (amount: number) => {
    setFundingAmount(amount.toString());
  };

  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(fundingAmount);
    if (!amountVal || amountVal <= 0) {
      showToast('Please enter a valid amount to deposit.', 'error');
      return;
    }

    fundWallet(amountVal);
    setJustFundedAmount(amountVal);
    setFundingAmount('');
    setIsFundingSuccessOpen(true);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber || !newCardExpiry) {
      showToast('Please fill in card details.', 'error');
      return;
    }

    const last4 = newCardNumber.trim().slice(-4) || '1234';
    addCard(newCardBrand, last4, newCardExpiry);
    
    // Clear fields
    setNewCardNumber('');
    setNewCardExpiry('');
    setIsAddCardOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8" id="wallet_view_panel">
      
      {/* Title */}
      <div className="text-left mb-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          My Smart Wallet
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Fund your digital wallet securely, save recurring credit cards, and view transaction statements.
        </p>
      </div>

      {/* Styled Glass Credit Card container */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 bg-linear-to-tr from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl relative overflow-hidden text-left">
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Total Available Balance</span>
            <p className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
              ₦{currentUser?.walletBalance.toLocaleString() || '0'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-[11px] font-medium text-slate-400">Account status: <span className="text-emerald-400 font-bold uppercase tracking-wider">Verified</span></span>
              <div className="h-3 w-[1px] bg-slate-700" />
              <span className="text-[11px] font-medium text-slate-400">{currentUser?.savedCards.length || 0} Saved cards</span>
            </div>
          </div>
          
          <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-klean-green shrink-0 shadow-lg">
            <Wallet size={28} className="animate-pulse" />
          </div>
        </div>
      </div>

      {/* Tab navigation bars */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('fund')}
          className={`px-6 py-3 font-semibold text-sm relative transition-all cursor-pointer ${
            activeTab === 'fund' ? 'text-klean-green' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Fund Wallet</span>
          {activeTab === 'fund' && (
            <motion.div layoutId="wallet_tab_underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-klean-green" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`px-6 py-3 font-semibold text-sm relative transition-all cursor-pointer ${
            activeTab === 'cards' ? 'text-klean-green' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Saved Cards</span>
          {activeTab === 'cards' && (
            <motion.div layoutId="wallet_tab_underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-klean-green" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-semibold text-sm relative transition-all cursor-pointer ${
            activeTab === 'history' ? 'text-klean-green' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Transaction History</span>
          {activeTab === 'history' && (
            <motion.div layoutId="wallet_tab_underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-klean-green" />
          )}
        </button>
      </div>

      {/* Tabs active panels */}
      <div className="min-h-[300px]">
        {activeTab === 'fund' ? (
          
          /* Tab Panel 1: Fund Wallet Form */
          <div className="space-y-6 text-left max-w-xl">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-800">Add Funds instantly</h3>
              <p className="text-xs text-slate-400 mt-0.5">Fund securely using secure Paystack gateways. Standard bank rates do apply.</p>
            </div>

            <form onSubmit={handleFundSubmit} className="space-y-4">
              {/* Preset chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Quick Preset Amounts (₦)</label>
                <div className="flex flex-wrap gap-2">
                  {[1000, 2500, 5000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleQuickFund(preset)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                        fundingAmount === preset.toString()
                          ? 'bg-klean-green text-white border-klean-green shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-350 text-slate-700'
                      }`}
                    >
                      +₦{preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Custom Deposit Amount (₦)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₦</span>
                  <input
                    type="number"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    placeholder="Enter amount..."
                    min="100"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-klean-navy/30 rounded-xl text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-850 text-white font-bold py-3 px-4 rounded-xl shadow-xs text-xs tracking-wide cursor-pointer flex items-center justify-center gap-2"
                id="btn_submit_funding"
              >
                <Wallet size={16} />
                <span>Deposit via Paystack</span>
              </button>
            </form>
          </div>

        ) : activeTab === 'cards' ? (
          
          /* Tab Panel 2: Saved Credit cards */
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-800">Saved Payment Methods</h3>
                <p className="text-xs text-slate-400 mt-0.5">Add and delete credit cards synced securely for on-demand waste bookings.</p>
              </div>

              <button
                onClick={() => setIsAddCardOpen(true)}
                className="bg-slate-950 hover:bg-slate-850 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={14} />
                <span>Add Card</span>
              </button>
            </div>

            {/* Credit cards list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {currentUser?.savedCards.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  <CreditCard size={36} className="mx-auto mb-2 text-slate-350" />
                  <span className="text-sm font-semibold">No credit cards added</span>
                  <button onClick={() => setIsAddCardOpen(true)} className="text-xs text-klean-green hover:underline font-bold block mx-auto mt-2 cursor-pointer">
                    Add new card now
                  </button>
                </div>
              ) : (
                currentUser?.savedCards.map((card: SavedCard) => (
                  <div
                    key={card.id}
                    className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md relative flex flex-col justify-between h-36"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest">{card.brand} CARD</span>
                      <button
                        onClick={() => removeCard(card.id)}
                        className="text-slate-450 hover:text-red-500 transition-colors p-1"
                        title="Delete Card"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div>
                      <span className="block text-lg font-mono tracking-widest">•••• •••• •••• {card.last4}</span>
                      <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        <span>Card Holder</span>
                        <span>Exp {card.expiry}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        ) : (
          
          /* Tab Panel 3: Transactions audit ledger lists */
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-800">Financial Log</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Verify your chronological wallet audits, funding statements, and pickup costs.</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-2xs">
              {transactions.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Wallet size={36} className="mx-auto mb-2 text-slate-300" />
                  <span className="text-sm font-semibold">No balance changes reported</span>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {transactions.map((txn: WalletTransaction) => {
                    const isCredit = txn.type === 'funding' || txn.type === 'refund';
                    return (
                      <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                          }`}>
                            {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-slate-850">{txn.description}</span>
                            <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">{txn.date} • Code {txn.id}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`block text-sm font-mono font-extrabold ${
                            isCredit ? 'text-emerald-600' : 'text-slate-800'
                          }`}>
                            {isCredit ? '+' : '-'}₦{txn.amount.toLocaleString()}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">Success</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Funding success dialog overlay */}
      <AnimatePresence>
        {isFundingSuccessOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl text-center space-y-6"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Check size={28} />
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-2xl text-slate-900">Wallet Funded!</h3>
                <p className="text-xs text-slate-400 leading-relaxed pt-2 max-w-xs mx-auto">
                  Instant deposit of <span className="text-slate-800 font-extrabold">₦{justFundedAmount.toLocaleString()}</span> completed via Paystack gateways. Your funds are active immediately inside your dashboard.
                </p>
              </div>

              <button
                onClick={() => setIsFundingSuccessOpen(false)}
                className="w-full bg-slate-950 hover:bg-slate-850 text-white font-bold py-3 text-xs rounded-xl cursor-pointer"
              >
                Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Card dialog modal overlay */}
      <AnimatePresence>
        {isAddCardOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl text-left space-y-6"
            >
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">Add Credit Card</h3>
                <p className="text-xs text-slate-400 mt-1">Add Visa or Mastercard systems to your wallet manager securely.</p>
              </div>

              <form onSubmit={handleAddCardSubmit} className="space-y-4">
                
                {/* Brand selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-600">Card Provider</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Visa', 'Mastercard'].map((brand) => (
                      <div
                        key={brand}
                        onClick={() => setNewCardBrand(brand as 'Visa' | 'Mastercard')}
                        className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                          newCardBrand === brand
                            ? 'bg-slate-950 border-slate-950 text-white shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-600">Secure Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4532 8901 2345 6789"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 px-4 py-3 text-sm rounded-xl font-mono"
                  />
                </div>

                {/* Card Expiry */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-600">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="12/26"
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 px-4 py-3 text-sm rounded-xl font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCardOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 text-xs rounded-xl flex-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-klean-green hover:bg-klean-green-hover text-white font-bold py-3 text-xs rounded-xl flex-1 cursor-pointer"
                  >
                    Save Card
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
