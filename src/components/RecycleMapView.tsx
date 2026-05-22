import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useKleanStore } from '../store/useKleanStore';
import { MapPin, Search, Navigation, Milestone, Sparkles, Filter, Check } from 'lucide-react';
import { RecyclingPoint } from '../types';

export default function RecycleMapView() {
  const { logDropOff, currentUser, dropOffLogs, adminApproveDropOff, adminRejectDropOff } = useKleanStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<RecyclingPoint | null>(null);
  const [isSimulatedAtStation, setIsSimulatedAtStation] = useState(false);
  
  // Directions simulation state
  const [showDirectionsRoute, setShowDirectionsRoute] = useState(false);

  const seedPoints: RecyclingPoint[] = [
    {
      id: 'pt_1',
      name: 'Ikeja Drop-off Station',
      area: 'Ikeja',
      address: 'Alausa Shopping Mall Ground, Ikeja, Lagos',
      latitude: 40,
      longitude: 25,
      description: 'E-waste and cardboard processing depot powered by Alausa Climate Initiative.',
      materials: ['Plastics', 'Electronic Waste', 'Paper Cardboard']
    },
    {
      id: 'pt_2',
      name: 'Yaba Depot Hub',
      area: 'Yaba',
      address: '10 Herbert Macaulay Way near CC-Hub, Yaba, Lagos',
      latitude: 50,
      longitude: 45,
      description: 'Community drop-off point for sorted plastics and packaging paperboards.',
      materials: ['Plastics', 'Glass bottles', 'Metal Cans']
    },
    {
      id: 'pt_3',
      name: 'Victoria Island Recycling Spot',
      area: 'Victoria Island',
      address: '42 Adeola Odeku Street, Victoria Island, Lagos',
      latitude: 75,
      longitude: 65,
      description: 'Premium premium recycling unit collecting upscale waste and sorted plastics.',
      materials: ['Plastics', 'Glass bottles', 'Paper Cardboard']
    },
    {
      id: 'pt_4',
      name: 'Lekki Phase 1 Center',
      area: 'Lekki',
      address: '8 Admiralty Way near Lekki Toll, Phase 1, Lagos',
      latitude: 85,
      longitude: 80,
      description: 'High-speed autonomous plastic bottle compactor station.',
      materials: ['Plastics', 'Metal Cans']
    },
    {
      id: 'pt_5',
      name: 'Surulere Waste Station',
      area: 'Surulere',
      address: 'Adeniran Ogunsanya St near National Stadium, Surulere, Lagos',
      latitude: 35,
      longitude: 60,
      description: 'Household bulk items, papers, plastic sorting center.',
      materials: ['Glass bottles', 'Metal Cans', 'Plastics']
    }
  ];

  // Map markers select centering
  const handleSelectPoint = (pt: RecyclingPoint) => {
    setSelectedPoint(pt);
    setShowDirectionsRoute(false);
  };

  // Log Drop-off rewarding
  const handleLogDropOffClick = (pt: RecyclingPoint) => {
    logDropOff(pt.name, isSimulatedAtStation, `LAG-${pt.latitude}.${pt.longitude}`);
  };

  // Searching logic
  const filteredPoints = seedPoints.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8" id="recycle_map_panel">
      
      {/* Title */}
      <div className="text-left mb-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          Recycle Points Finder
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Explore recycling centers across Lekki, Yaba, Surulere, Ikeja, and Victoria Island in Lagos.
        </p>
      </div>

      {/* Main split dashboard panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Filter and Locations List */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search Ikeja, Lekki, or Yaba..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-205 focus:border-slate-350 rounded-xl text-xs font-semibold"
              />
            </div>

            {/* List entries */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {filteredPoints.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-semibold text-xs">
                  No depots matching your criteria.
                </div>
              ) : (
                filteredPoints.map((pt) => {
                  const isCurrent = selectedPoint?.id === pt.id;
                  return (
                    <div
                      key={pt.id}
                      onClick={() => handleSelectPoint(pt)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                        isCurrent
                          ? 'border-klean-green bg-emerald-50/50 shadow-xs'
                          : 'border-slate-150 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrent ? 'bg-klean-green text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        <MapPin size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-slate-800 truncate">{pt.name}</span>
                        <span className="block text-[11px] text-slate-440 truncate mt-0.5">{pt.address}</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pt.materials.slice(0, 2).map((m, i) => (
                            <span key={i} className="text-[8px] font-extrabold uppercase bg-slate-100 px-1.5 py-0.5 rounded-sm text-slate-500">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Stats award helper */}
          <div className="bg-yellow-50 border border-yellow-105 p-4 rounded-2xl text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-yellow-800 flex items-center gap-1">
              <Sparkles size={12} className="animate-pulse" />
              <span>LOG MY DROP-OFF REWARDING</span>
            </span>
            <p className="text-[11px] text-yellow-750 font-semibold mt-1 leading-relaxed">
              Arrived at a center? Choose "Teleport to Station" on the selected station details, then click "Log My Drop-Off" so city admins can vet and credit +10 KleanPoints safely!
            </p>
          </div>
        </div>

        {/* Right Column: Premium High-Contrast stylized interactive Map Sim */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-lg relative flex flex-col justify-between overflow-hidden min-h-[440px] text-white">
          
          {/* MAP CANVAS PANEL SIMULATION */}
          <div className="flex-1 relative bg-slate-950 p-4 transition-colors overflow-hidden flex items-center justify-center">
            
            {/* Map Grid lines design */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(ellipse at center, #00a859 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />

            {/* Custom styled road vectors */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20 stroke-slate-500 stroke-[0.3] fill-none pointer-events-none">
              <line x1="0" y1="20" x2="100" y2="20" />
              <line x1="0" y1="50" x2="100" y2="80" />
              <line x1="20" y1="0" x2="20" y2="100" />
              <line x1="70" y1="0" x2="70" y2="100" />
              <circle cx="50" cy="50" r="30" />
            </svg>

            {/* Directions Line Route simulator overlay */}
            {showDirectionsRoute && selectedPoint && (
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full stroke-yellow-400 stroke-1 stroke-dasharray-[2] fill-none pointer-events-none z-15">
                <motion.path
                  d={`M20,80 L${selectedPoint.latitude},${selectedPoint.longitude}`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
            )}

            {/* User current position indicator overlay bottom left */}
            <div className="absolute transition-transform bg-blue-500 border-4 border-slate-900 rounded-full w-4 h-4 shadow-lg flex items-center justify-center z-20" style={{ left: '20%', bottom: '20%' }}>
              <span className="absolute w-6 h-6 rounded-full bg-blue-500/30 animate-ping" />
            </div>

            {/* Render Map Pin Coordinates */}
            {seedPoints.map((pt) => {
              const isActive = selectedPoint?.id === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => handleSelectPoint(pt)}
                  className="absolute cursor-pointer transition-transform duration-300 hover:scale-125 z-10"
                  style={{ left: `${pt.latitude}%`, top: `${pt.longitude}%` }}
                >
                  <div className="relative">
                    {/* Ring pulsing glows */}
                    {isActive ? (
                      <span className="absolute -inset-2.5 bg-klean-green/40 rounded-full animate-ping" />
                    ) : (
                      <span className="absolute -inset-1.5 bg-slate-500/20 rounded-full" />
                    )}

                    <div className={`p-2 rounded-full flex items-center justify-center shadow-lg border border-slate-900 transition-all ${
                      isActive ? 'bg-klean-green text-white scale-110' : 'bg-slate-800 text-slate-300'
                    }`}>
                      <MapPin size={14} className="fill-current" />
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Floating directions helper indicator */}
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>Lagos Island GPS Central</span>
            </div>
          </div>

          {/* Node specifics Panel inside footer */}
          <AnimatePresence mode="wait">
            {selectedPoint ? (
              <motion.div
                key={selectedPoint.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-slate-900 border-t border-slate-800 p-6 space-y-4 text-left z-20"
              >
                {/* Geolocation Verification Bar */}
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Device Geolocation Status</span>
                    {isSimulatedAtStation ? (
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Arrived & Verified At Station GPS Coordinates</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span>Not Co-located (Distance: 12.4 km away)</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsSimulatedAtStation(false)}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] font-bold transition-all cursor-pointer ${
                        !isSimulatedAtStation
                          ? 'bg-rose-950/40 text-rose-300 border-rose-800'
                          : 'bg-slate-800/40 text-slate-500 border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      Away (Default)
                    </button>
                    <button
                      onClick={() => setIsSimulatedAtStation(true)}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] font-bold transition-all cursor-pointer ${
                        isSimulatedAtStation
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                          : 'bg-slate-800/40 text-slate-500 border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      Teleport to Station
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">{selectedPoint.name}</h3>
                    <span className="text-xs text-klean-green font-mono">{selectedPoint.address}</span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowDirectionsRoute(true)}
                      className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 flex-1 cursor-pointer transition-colors"
                    >
                      <Navigation size={14} />
                      <span>{showDirectionsRoute ? 'Recalculating Path...' : 'Directions'}</span>
                    </button>

                    <button
                      onClick={() => handleLogDropOffClick(selectedPoint)}
                      className="bg-klean-green hover:bg-klean-green-hover text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 flex-1 cursor-pointer transition-all shadow-md"
                      id="btn_log_dropoff"
                    >
                      <Check size={14} />
                      <span>Log My Drop-Off</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800/60 pt-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Description</span>
                    <p className="text-xs text-slate-300 font-semibold mt-1 leading-relaxed">{selectedPoint.description}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Accepted Materials</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedPoint.materials.map((m, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-[9px] px-2.5 py-0.5 rounded-full">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs border-t border-slate-800/50 bg-slate-900 font-medium">
                Select a recycler recycling pin to view accepting assets and directions.
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Geolocation Verification & Admin Vetting Control Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200/60 pt-8" id="dropoff_vetting_dashboards">
        
        {/* User Stats Tracking */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 text-left">
          <div className="flex items-center gap-2">
            <Milestone className="text-slate-500 font-bold" size={20} />
            <div>
              <h3 className="font-display font-semibold text-lg text-slate-800">Your Drop-Off History</h3>
              <p className="text-xs text-slate-400">Track and monitor your logged drop-off logs.</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {dropOffLogs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-400 font-medium">
                No drop-off logs submitted yet. Locate a recycling station and click "Log My Drop-Off".
              </div>
            ) : (
              dropOffLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-display font-medium text-slate-800">{log.stationName}</span>
                    <span className="block text-[10px] text-slate-450 font-mono">{log.date} • GPS: {log.gpsCoordinates}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full font-bold text-[9px] uppercase border ${
                    log.status === 'Approved' 
                      ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
                      : log.status === 'Rejected'
                        ? 'bg-red-100 border-red-200 text-red-700'
                        : 'bg-amber-100 border-amber-200 text-amber-700'
                  }`}>
                    {log.status === 'Pending' ? 'Pending Vet' : log.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Admin Vetting Control Dashboard */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4 text-left text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="text-klean-green" size={20} />
            <div>
              <h3 className="font-display font-medium text-lg text-white">Admin Drop-Off Vetting Center</h3>
              <p className="text-xs text-slate-400">Manage drop-offs and approve credits securely.</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {dropOffLogs.filter(l => l.status === 'Pending').length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-850 text-xs text-slate-500 font-medium">
                No pending drop-off reports to vet. Submit a GPS verified drop-off report above first!
              </div>
            ) : (
              dropOffLogs.filter(l => l.status === 'Pending').map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-display font-medium text-white">{log.stationName}</span>
                    <span className="block text-[10px] text-slate-500 font-mono">User ID: ...{log.userId.slice(-6)} • Coordinates: {log.gpsCoordinates}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => adminRejectDropOff(log.id)}
                      className="bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => adminApproveDropOff(log.id)}
                      className="bg-klean-green hover:bg-klean-green-hover text-white px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all cursor-pointer shadow-md"
                    >
                      Approve (+10)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
