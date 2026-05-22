import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useKleanStore } from '../store/useKleanStore';
import { MapPin, Search, Navigation, Milestone, Sparkles, Filter, Check } from 'lucide-react';
import { RecyclingPoint } from '../types';

export default function RecycleMapView() {
  const { logDropOff, currentUser } = useKleanStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<RecyclingPoint | null>(null);
  
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
    logDropOff(pt.name);
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
              <span>LOG MY DROP-OFF REWARDRY</span>
            </span>
            <p className="text-[11px] text-yellow-750 font-semibold mt-1 leading-relaxed">
              Arrived at a center? Click "Log My Drop-Off" inside the node details trigger to instantly claim +10 loyalty KleanPoints!
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

    </div>
  );
}
