import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useKleanStore } from '../store/useKleanStore';
import { MapPin, Calendar, Recycle, Wallet, CreditCard, ChevronRight, ChevronLeft, Check, Sparkles, AlertCircle } from 'lucide-react';

interface SchedulePickupViewProps {
  setView: (view: string) => void;
}

export default function SchedulePickupView({ setView }: SchedulePickupViewProps) {
  const { currentUser, schedulePickup, fundWallet, showToast } = useKleanStore();
  
  // Wizard state machine
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1 states: Address
  const [addressSearch, setAddressSearch] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState(currentUser ? '+234 803 123 4567' : '');
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Pre-seeded Lagos addresses
  const lagosAddresses = [
    '15 Awolowo Road, Ikoyi, Lagos',
    '42 Adeola Odeku Street, Victoria Island, Lagos',
    '8 Admiralty Way, Lekki Phase 1, Lagos',
    '23 Opebi Road, Ikeja, Lagos',
    '10 Herbert Macaulay Way, Yaba, Lagos'
  ];

  // Step 2 states: Slot
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const datesList = [
    { label: 'Monday, May 19, 2026', key: 'May 19, 2026' },
    { label: 'Wednesday, May 21, 2026', key: 'May 21, 2026' },
    { label: 'Friday, May 23, 2026', key: 'May 23, 2026' },
    { label: 'Saturday, May 24, 2026', key: 'May 24, 2026' }
  ];

  const timeSlots = [
    { time: '8:00 AM - 12:00 PM', left: 4 },
    { time: '12:00 PM - 3:00 PM', left: 2 },
    { time: '3:00 PM - 6:00 PM', left: 0, booked: true } // fully booked indicator to represent screenshot
  ];

  // Step 3 states: Waste & Bags
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);
  const [bagsCount, setBagsCount] = useState(4); // default minimum of 4

  const wasteCategories = [
    { id: 'General Waste', name: 'General Waste', desc: 'Non-recyclable domestic items', icon: Recycle, color: 'text-slate-600 bg-slate-50 border-slate-200' },
    { id: 'Recycling', name: 'Recyclables', desc: 'Plastics, metal cans, paper cardboard', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'Organic Waste', name: 'Organic Waste', desc: 'Food waste, composting garden remnants', icon: Recycle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'Electronic Waste', name: 'E-Waste', desc: 'Discarded computer parts, cables, chargers', icon: CreditCard, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' }
  ];

  // Step 4 states: Payments
  const [paymentMethod, setPaymentMethod] = useState('Wallet'); 
  const [selectedSavedCard, setSelectedSavedCard] = useState('');
  
  // Paystack credit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // Cost rules: ₦500 per bag
  const costPerBag = 500;
  const totalPrice = bagsCount * costPerBag;

  // Validation switches
  const handleNext = () => {
    setErrorMsg('');

    if (step === 1) {
      if (!selectedAddress) {
        setErrorMsg('Please select an address from the suggestion list.');
        return;
      }
      if (!isConfirmed) {
        // EXACT VALIDATION MESSAGE SPECIFIED: "Please confirm address for pickup."
        setErrorMsg('Please confirm address for pickup.');
        return;
      }
      if (!phone) {
        setErrorMsg('Please enter a phone number.');
        return;
      }
      setStep(2);
    }
    
    else if (step === 2) {
      if (!selectedDate || !selectedSlot) {
        setErrorMsg('Please select both a date and a time slot.');
        return;
      }
      setStep(3);
    }
    
    else if (step === 3) {
      if (selectedWasteTypes.length === 0) {
        setErrorMsg('Please select at least one type of waste category.');
        return;
      }
      if (!bagsCount) {
        // EXACT VALIDATION MESSAGE SPECIFIED: "Please specify number of bags."
        setErrorMsg('Please specify number of bags.');
        return;
      }
      if (bagsCount < 4) {
        // EXACT VALIDATION MESSAGE SPECIFIED: "Please enter minimum number of bags (4)."
        setErrorMsg('Please enter minimum number of bags (4).');
        return;
      }
      setStep(4);
    }
    
    else if (step === 4) {
      if (paymentMethod === 'Card' && (!cardNumber || !cardExpiry || !cardCvv)) {
        setErrorMsg('Please fill in necessary fields for your credit card.');
        return;
      }
      if (paymentMethod === 'Wallet' && currentUser) {
        if (currentUser.walletBalance < totalPrice) {
          setErrorMsg(`Insufficient wallet balance. Total amount required: ₦${totalPrice.toLocaleString()}. Please fund your wallet or select another payment option.`);
          return;
        }
      }
      setStep(5);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleWasteType = (type: string) => {
    if (selectedWasteTypes.includes(type)) {
      setSelectedWasteTypes(selectedWasteTypes.filter(t => t !== type));
    } else {
      setSelectedWasteTypes([...selectedWasteTypes, type]);
    }
  };

  const handleConfirmOrder = () => {
    try {
      const selectedPaymentLabel = paymentMethod === 'Wallet' 
        ? 'Wallet' 
        : paymentMethod === 'Cash' 
          ? 'On Pickup (Cash)' 
          : `Card ending in ${cardNumber.slice(-4) || '4532'}`;

      schedulePickup({
        address: selectedAddress,
        landmark,
        phone,
        date: selectedDate,
        timeSlot: selectedSlot,
        bagsCount,
        wasteTypes: selectedWasteTypes,
        price: totalPrice,
        paymentMethod: selectedPaymentLabel
      });

      setView('dashboard');
    } catch (e: any) {
      setErrorMsg(e?.message || 'Error occurred during checkout.');
    }
  };

  // Steps headers list
  const stepsList = [
    { num: 1, label: 'Address', icon: MapPin },
    { num: 2, label: 'Time Slot', icon: Calendar },
    { num: 3, label: 'Waste Type', icon: Recycle },
    { num: 4, label: 'Payment', icon: Wallet },
    { num: 5, label: 'Confirm', icon: Check }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8" id="schedule_pickup_container">
      
      {/* Title block */}
      <div className="text-left mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          Schedule Trash Pickup
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Complete the quick multi-step booking wizard to schedule waste collection in Lagos.
        </p>
      </div>

      {/* Modern Horizontal Stepper Indicators */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs mb-8">
        <div className="flex items-center justify-between gap-2">
          {stepsList.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            return (
              <div key={s.num} className="flex-1 flex items-center">
                <div className="flex flex-col sm:flex-row items-center gap-2 mx-auto">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold transition-all ${
                    isCompleted 
                      ? 'bg-klean-green text-white shadow-xs' 
                      : isActive 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? <Check size={14} /> : s.num}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide hidden md:inline transition-colors ${
                    isActive ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div className={`hidden md:block h-[2px] w-full mx-2 transition-colors ${
                    step > s.num ? 'bg-klean-green' : 'bg-slate-100'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error alert message banner */}
      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-xs font-semibold flex items-center gap-3 text-left"
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Main Wizard Form Wrapper */}
      <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 shadow-xl min-h-[400px] flex flex-col justify-between">
        
        <div className="flex-1 pb-8">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Address select */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-800">1. Pickup Location Details</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Please provide and confirm the exact collection details.</p>
                </div>

                <div className="space-y-4">
                  {/* Lagos Address Suggestion Search */}
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Lagos Address (Select below)</label>
                    <input
                      type="text"
                      value={addressSearch || selectedAddress}
                      onChange={(e) => {
                        setAddressSearch(e.target.value);
                        setSelectedAddress('');
                      }}
                      placeholder="Type road, street or select from suggested spots..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-klean-navy/30 rounded-xl text-sm focus:outline-none focus:bg-white text-slate-850 font-medium"
                    />

                    {/* Filtered suggestions list based on Lagos seeds */}
                    {(!selectedAddress) && (
                      <div className="absolute left-0 right-0 top-full bg-white border border-slate-100 rounded-xl shadow-lg mt-1 overflow-hidden z-20">
                        {lagosAddresses
                          .filter(addr => addr.toLowerCase().includes(addressSearch.toLowerCase()))
                          .map((addr) => (
                            <div
                              key={addr}
                              onClick={() => {
                                setSelectedAddress(addr);
                                setAddressSearch(addr);
                                setErrorMsg('');
                              }}
                              className="px-4 py-3 text-sm hover:bg-slate-50 text-slate-700 cursor-pointer flex items-center gap-2 border-b border-separate last:border-0"
                            >
                              <MapPin size={14} className="text-klean-green shrink-0" />
                              <span className="font-medium text-slate-800">{addr}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Landmark */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nearby Landmark (Optional)</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opposite Lekki Mall, Phase 1"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-klean-navy/30 rounded-xl text-sm focus:outline-none focus:bg-white text-slate-850 font-medium"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Contact Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 123 4567"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-klean-navy/30 rounded-xl text-sm"
                    />
                  </div>

                  {/* Checkbox Affirmation rule confirmation: "Please confirm address for pickup." */}
                  <label className="flex items-start gap-3 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl cursor-pointer pt-3">
                    <input
                      type="checkbox"
                      checked={isConfirmed}
                      onChange={(e) => setIsConfirmed(e.target.checked)}
                      className="mt-1 rounded-xs border-slate-300 text-klean-green focus:ring-klean-green"
                    />
                    <div className="text-xs text-slate-600 font-semibold text-left select-none leading-normal">
                      <span>I confirm that the address, nearby landmark, and phone number listed above are correct.</span>
                    </div>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Step 2: Time Slot */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-800">2. Select Collection Time</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Select a date and an available slot that is convenient for you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select Date card column */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">1. Pickup Date</label>
                    <div className="space-y-2">
                      {datesList.map((dt) => (
                        <div
                          key={dt.key}
                          onClick={() => setSelectedDate(dt.key)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            selectedDate === dt.key
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <span className="block text-sm font-bold">{dt.key}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select Time slot column */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">2. Available Intervals</label>
                    <div className="space-y-2">
                      {timeSlots.map((ts, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            if (!ts.booked) {
                              setSelectedSlot(ts.time);
                            }
                          }}
                          className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                            ts.booked 
                              ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60' 
                              : selectedSlot === ts.time
                                ? 'bg-klean-green text-white border-klean-green shadow-md'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 cursor-pointer'
                          }`}
                        >
                          <div>
                            <span className="block text-sm font-bold">{ts.time}</span>
                            <span className="block text-[10px] mt-0.5 uppercase tracking-wide font-semibold">
                              {ts.booked ? 'Fully Booked' : `${ts.left} collector slots left`}
                            </span>
                          </div>
                          {ts.booked && (
                            <span className="text-[10px] bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold">FULL</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Waste & Bags selection */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-800">3. Waste & Bag Selection</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Please check garbage categories. Standard fee is ₦500 per bag. Minimum is 4 bags.</p>
                </div>

                <div className="space-y-6">
                  {/* Category cards grid */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Waste Categories</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wasteCategories.map((c) => {
                        const isChecked = selectedWasteTypes.includes(c.id);
                        return (
                          <div
                            key={c.id}
                            onClick={() => toggleWasteType(c.id)}
                            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-4 ${
                              isChecked
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="mt-1 h-4 w-4 rounded-xs text-klean-green bg-slate-100 border-slate-300 focus:ring-klean-green shrink-0 cursor-pointer pointer-events-none"
                            />
                            <div>
                              <span className="block text-sm font-bold">{c.name}</span>
                              <span className="block text-[11px] text-slate-400 mt-1 leading-snug">{c.desc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bags Count selector */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="block text-sm font-bold text-slate-800">Specify Number of Bags</span>
                      <span className="block text-xs text-slate-400 mt-0.5 font-medium">Lagos rule: pickups must consist of a minimum of 4 garbage bags.</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setBagsCount(Math.max(0, bagsCount - 1))}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-center font-bold text-slate-700 text-lg transition-transform active:scale-95 shadow-2xs"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={bagsCount}
                        onChange={(e) => setBagsCount(parseInt(e.target.value) || 0)}
                        className="w-16 h-10 bg-white border border-slate-200 rounded-xl text-center font-display font-medium text-sm text-slate-900"
                      />
                      <button
                        onClick={() => setBagsCount(bagsCount + 1)}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-center font-bold text-slate-700 text-lg transition-transform active:scale-95 shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Dynamic cost preview */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                    <span>Pricing Formula: ₦500 per bag</span>
                    <span>Total Estimate: <span className="font-display text-lg text-slate-800 font-bold ml-1.5">₦{totalPrice.toLocaleString()}</span></span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-800">4. Select Payment method</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Choose your payment mode. Total pickup fee: ₦{totalPrice.toLocaleString()}.</p>
                </div>

                <div className="space-y-6">
                  
                  {/* Select Mode chips options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'Wallet', label: 'Wallet Balance', desc: `Bal: ₦${currentUser?.walletBalance.toLocaleString() || '0'}`, icon: Wallet },
                      { id: 'Card', label: 'Online Card', desc: 'Secure Paystack', icon: CreditCard },
                      { id: 'Cash', label: 'Pay on Pickup', desc: 'Cash payment', icon: Recycle }
                    ].map((mode) => (
                      <div
                        key={mode.id}
                        onClick={() => setPaymentMethod(mode.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === mode.id
                            ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <mode.icon size={20} className="mb-2" />
                        <span className="block text-sm font-bold">{mode.label}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{mode.desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Paystack Card form configuration option */}
                  {paymentMethod === 'Card' && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                      <span className="block text-xs font-extrabold uppercase tracking-widest text-slate-500">Paystack Credit Card details</span>
                      
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase text-slate-600">Card Number</label>
                          <input
                            type="text"
                            maxLength={19}
                            placeholder="4532 8901 2345 6789"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="bg-white border border-slate-200 focus:border-slate-300 rounded-xl px-4 py-2.5 text-sm w-full font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-600">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              maxLength={5}
                              placeholder="12/26"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-full font-mono"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-600">CVV</label>
                            <input
                              type="password"
                              maxLength={3}
                              placeholder="123"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-full font-mono"
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer pt-2">
                          <input
                            type="checkbox"
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                            className="rounded-xs text-klean-green focus:ring-klean-green border-slate-300"
                          />
                          <span className="text-xs text-slate-500 font-semibold">Save card details to secure wallet manager</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Wallet details with balance fund option */}
                  {paymentMethod === 'Wallet' && currentUser && (
                    <div className="bg-emerald-50/50 p-6 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="block text-sm font-bold text-slate-800">Wallet Checkout</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Your current balance: ₦{currentUser.walletBalance.toLocaleString()}</span>
                      </div>
                      
                      {currentUser.walletBalance < totalPrice ? (
                        <button
                          onClick={() => {
                            fundWallet(totalPrice - currentUser.walletBalance);
                            setErrorMsg('');
                          }}
                          className="bg-klean-green hover:bg-klean-green-hover text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xs cursor-pointer shrink-0"
                        >
                          Quick Fund Wallet (₦{totalPrice - currentUser.walletBalance})
                        </button>
                      ) : (
                        <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <Check size={16} />
                          <span>Balance Sufficient</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 5: Recap Confirmation */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div className="text-center py-4 space-y-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900">Review Booking Details</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">Please double check your pickup coordinates before submitting to the nearest collector.</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 divide-y divide-slate-200/50 text-sm font-medium text-slate-700">
                  <div className="py-2 flex items-start justify-between gap-4">
                    <span className="text-slate-400">Address Location:</span>
                    <span className="text-slate-800 font-bold text-right">{selectedAddress}</span>
                  </div>
                  <div className="py-2 flex items-start justify-between gap-4">
                    <span className="text-slate-400">Time Appointment:</span>
                    <span className="text-slate-800 font-bold text-right">{selectedDate} at {selectedSlot}</span>
                  </div>
                  <div className="py-2 flex items-start justify-between gap-4">
                    <span className="text-slate-400">Waste Categories:</span>
                    <span className="text-slate-800 font-bold text-right">{selectedWasteTypes.join(', ')}</span>
                  </div>
                  <div className="py-2 flex items-start justify-between gap-4">
                    <span className="text-slate-400">Bags Count:</span>
                    <span className="text-slate-800 font-mono font-bold">{bagsCount} Bags</span>
                  </div>
                  <div className="py-2 flex items-start justify-between gap-4">
                    <span className="text-slate-400">Payment:</span>
                    <span className="text-slate-800 font-bold">{paymentMethod === 'Wallet' ? 'Wallet Deduct' : paymentMethod === 'Cash' ? 'Pay on Pickup (Cash)' : 'Online Card'}</span>
                  </div>
                  <div className="py-2 flex items-start justify-between gap-4 text-slate-900 font-extrabold text-base pt-3 border-t-2">
                    <span>Total Cost:</span>
                    <span className="font-display text-klean-green text-lg">₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-105 rounded-xl text-xs text-yellow-800 font-bold flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-500" />
                  <span>Sweet benefit! Concluding this pickup successfully awards you +5 KleanPoints loyal points!</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Action Controls Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="border border-slate-200 hover:border-slate-350 disabled:bg-slate-50 disabled:text-slate-350 bg-white font-bold px-6 py-3 rounded-xl shadow-2xs text-xs text-slate-700 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="bg-slate-950 hover:bg-slate-850 font-bold px-6 py-3 rounded-xl shadow-md text-white text-xs transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              id="btn_pickup_next"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleConfirmOrder}
              className="bg-klean-green hover:bg-klean-green-hover text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-xs cursor-pointer flex items-center gap-2"
              id="btn_pickup_confirm"
            >
              <Check size={16} />
              <span>Confirm & Lock Pickup</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
