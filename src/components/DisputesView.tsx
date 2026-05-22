import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useKleanStore } from '../store/useKleanStore';
import { AlertTriangle, Clock, CheckCircle, XCircle, Plus, Camera, Image as ImageIcon, ChevronRight, AlertCircle } from 'lucide-react';
import { Pickup } from '../types';

export default function DisputesView() {
  const { pickups, disputes, raiseDispute, cancelPickup, showToast } = useKleanStore();
  
  // Dialog state
  const [isRaiseOpen, setIsRaiseOpen] = useState(false);
  const [cancelAlertMsg, setCancelAlertMsg] = useState('');
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);

  // Form states
  const [selectedPickupId, setSelectedPickupId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Pickup not completed');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [mockAttachedImage, setMockAttachedImage] = useState(false);

  const disputeCategories = [
    'Pickup not completed',
    'Wrong waste type collected',
    'Collector arrived hours late',
    'Incorrect bag weight recorded',
    'Other complaints'
  ];

  const handleCancelClick = (pickupId: string) => {
    const res = cancelPickup(pickupId);
    if (!res.success && res.error) {
      // Set the exact string from PRD to render in the warning panel
      setCancelAlertMsg(res.error);
      setIsCancelAlertOpen(true);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickupId || !disputeDesc) {
      showToast('Please fill in necessary fields.', 'error');
      return;
    }

    raiseDispute(selectedPickupId, selectedCategory, disputeDesc);
    
    // Clear
    setSelectedPickupId('');
    setDisputeDesc('');
    setMockAttachedImage(false);
    setIsRaiseOpen(false);
  };

  const getDisputeIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="text-amber-500 animate-pulse" size={20} />;
      case 'Resolved':
        return <CheckCircle className="text-emerald-500" size={20} />;
      case 'Rejected':
        return <XCircle className="text-rose-500" size={20} />;
      default:
        return <AlertTriangle className="text-slate-500" size={20} />;
    }
  };

  const getDisputeStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8" id="disputes_view_panel">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Customer Care Support
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Track raised disputes, check resolution outcomes, and apply cancel policies securely.
          </p>
        </div>

        <button
          onClick={() => setIsRaiseOpen(true)}
          className="bg-slate-950 hover:bg-slate-850 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 shadow-md cursor-pointer text-xs"
          id="btn_open_raise_dispute"
        >
          <Plus size={16} />
          <span>Raise Dispute Ticket</span>
        </button>
      </div>

      {/* Safety cancel checker card list */}
      <div className="space-y-4">
        <div className="text-left">
          <h3 className="font-display font-bold text-lg text-slate-800">Your Active Schedules</h3>
          <p className="text-xs text-slate-400 mt-0.5">Below are your upcoming bookings. Note cancel policies apply.</p>
        </div>

        {pickups.filter(p => p.status === 'Pending' || p.status === 'Accepted').length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-400 font-medium">
            No pending bookings found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pickups.filter(p => p.status === 'Pending' || p.status === 'Accepted').map((pickup: Pickup) => (
              <div
                key={pickup.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs text-left flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">Scheduled #{pickup.id}</span>
                  <span className="block text-sm font-bold text-slate-800 pt-1">{pickup.wasteTypes.join(' & ')}</span>
                  <span className="block text-xs text-slate-400 font-semibold">{pickup.date} at {pickup.timeSlot}</span>
                </div>

                <button
                  onClick={() => handleCancelClick(pickup.id)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 px-3 py-1.5 rounded-xl border border-rose-100 hover:border-rose-200 transition-all cursor-pointer shrink-0"
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disputes ticket logs list */}
      <div className="space-y-4">
        <div className="text-left">
          <h3 className="font-display font-bold text-lg text-slate-800">Dispute History</h3>
          <p className="text-xs text-slate-400 mt-0.5">Monitor resolution status of past tickets.</p>
        </div>

        <div className="space-y-4">
          {disputes.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 shrink-0">
                  {getDisputeIcon(ticket.status)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-slate-800">{ticket.category}</span>
                    <span className="font-mono text-[10px] text-slate-400">#{ticket.id}</span>
                  </div>
                  <p className="text-xs text-slate-450 leading-relaxed font-semibold max-w-xl">{ticket.description}</p>
                  
                  {ticket.resolution && (
                    <span className="block text-[11px] text-emerald-600 font-mono font-bold pt-1">
                      Resolution Action Code: {ticket.resolution} Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full border ${getDisputeStatusColor(ticket.status)}`}>
                  {ticket.status === 'Pending' ? 'Under Review' : ticket.status}
                </span>
                <span className="block text-[10px] text-slate-400 mt-1.5 font-semibold">Posted {new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create dispute sheet drawer dialog overlay */}
      <AnimatePresence>
        {isRaiseOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-100 shadow-2xl text-left space-y-6 mt-8 mb-16"
            >
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">Raise Dispute Ticket</h3>
                <p className="text-xs text-slate-400 mt-0.5">Our support staff handles escalations within 3 business hours.</p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                
                {/* Pick references */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ref Booking ID</label>
                  <select
                    value={selectedPickupId}
                    onChange={(e) => setSelectedPickupId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 px-4 py-3 rounded-xl text-xs font-mono"
                  >
                    <option value="">Select past pickup schedule...</option>
                    {pickups.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.id} - ({p.date}, {p.wasteTypes.join('/')})
                      </option>
                    ))}
                    <option value="PU-2026-MOCK">Unlisted / Historical booking</option>
                  </select>
                </div>

                {/* Categories */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ticket Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 px-4 py-3 rounded-xl text-xs font-semibold"
                  >
                    {disputeCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Escalation Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide full details of your complaints (weight discrepancy, missing slot, unarrived fleet)..."
                    value={disputeDesc}
                    onChange={(e) => setDisputeDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 px-4 py-3 rounded-xl text-xs"
                  />
                </div>

                {/* Photo Dropzone Simulation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Photo Attachment (Optional)</label>
                  <div
                    onClick={() => setMockAttachedImage(!mockAttachedImage)}
                    className={`border border-dashed p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                      mockAttachedImage
                        ? 'border-klean-green bg-emerald-50/50 text-klean-green'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    {mockAttachedImage ? (
                      <div className="flex items-center gap-2">
                        <ImageIcon size={20} />
                        <span className="text-xs font-bold">Lagos_garbage_proof.png (Attached)</span>
                      </div>
                    ) : (
                      <>
                        <Camera size={20} className="mb-1 text-slate-400" />
                        <span className="text-xs font-bold font-sans">Simulate Drag & Drop Dispute Photo</span>
                        <span className="text-[10px] text-slate-400">Tapping toggles mock attachment state</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRaiseOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 text-xs rounded-xl flex-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-950 hover:bg-slate-850 text-white font-bold py-3 text-xs rounded-xl flex-1 cursor-pointer"
                  >
                    Submit Ticket
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Alert dialog satisfying EXACT STRING rule */}
      <AnimatePresence>
        {isCancelAlertOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-100 shadow-2xl relative text-center space-y-6 mt-8 mb-16"
            >
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <AlertTriangle size={24} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-red-500">Security Warning</span>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed pt-2">
                  {cancelAlertMsg}
                </p>
              </div>

              <button
                onClick={() => setIsCancelAlertOpen(false)}
                className="w-full bg-slate-950 hover:bg-slate-850 text-white font-bold py-3 text-xs rounded-xl cursor-pointer"
              >
                Close Warning
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
