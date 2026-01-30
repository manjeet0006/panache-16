import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Users, ShieldAlert, Rocket, Calendar,
  ChevronDown, ChevronUp, MapPin,
  Search, Zap, Sparkles, Filter, X,
  IndianRupee, Trophy, Music, Cpu, Layers, SlidersHorizontal
} from 'lucide-react';

import API from '../api';
import EventSkeleton from '@/components/loading/eventSkeleton';

const EventsExplorer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isVgu = searchParams.get('isVgu') === 'true';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);

  // --- FILTER STATES ---
  const [showFilters, setShowFilters] = useState(false); // Mobile Toggle
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [priceFilter, setPriceFilter] = useState("ALL");

  const CATEGORIES = [
    { id: 'PANACHE', label: 'Panache', icon: Music },
    { id: 'PRAGATI', label: 'Pragati', icon: Cpu },
    { id: 'PRATISHTHA', label: 'Pratishtha', icon: Trophy }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get(`/register/list-events?isVgu=${isVgu}`);
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [isVgu]);

  const filteredEvents = events.filter(e => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || e.category === selectedCategory;

    let matchesPrice = true;
    if (priceFilter === "FREE") matchesPrice = Number(e.eventPrice) === 0;
    if (priceFilter === "PAID") matchesPrice = Number(e.eventPrice) > 0;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Toggle Logic: If clicking active, reset to ALL. If clicking new, set to new.
  const handleCategoryClick = (catId) => {
    setSelectedCategory(prev => prev === catId ? "ALL" : catId);
  };

  const handlePriceClick = (type) => {
    setPriceFilter(prev => prev === type ? "ALL" : type);
  };

  const activeFiltersCount = (selectedCategory !== "ALL" ? 1 : 0) + (priceFilter !== "ALL" ? 1 : 0);

  // ... inside EventsExplorer.jsx

  if (loading) return <EventSkeleton/>

  return (
    <div className="min-h-screen bg-[#050505] pt-13 text-white  pb-5 relative selection:bg-pink-500/30">

      {/* Background Atmosphere */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <header className="mb-6 pt-10 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-6 backdrop-blur-xl">
            <Sparkles size={14} className="text-pink-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Panache Era 2026</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-6">
            <div className="text-white">Event</div> <div className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]">Explorer</div>
          </h1>

          {/* --- SMART SEARCH & FILTER BAR --- */}
          <div className="max-w-4xl mx-auto flex flex-col gap-4">

            {/* ROW 1: Search + Filter Toggle Button */}
            <div className="flex items-center gap-3 w-full max-w-xl mx-auto">
              {/* Search Input */}
              <div className="relative group flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-pink-500/40 focus:bg-white/[0.08] transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full transition-colors">
                    <X size={14} className="text-gray-400" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative p-3.5 rounded-2xl border transition-all md:hidden ${showFilters || activeFiltersCount > 0
                    ? "bg-pink-500 border-pink-500 text-white"
                    : "bg-white/[0.05] border-white/10 text-gray-400 hover:text-white"
                  }`}
              >
                <SlidersHorizontal size={20} />
                {activeFiltersCount > 0 && !showFilters && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white text-pink-500 text-[9px] font-black rounded-full flex items-center justify-center border border-pink-500">
                    {activeFiltersCount}
                  </div>
                )}
              </button>
            </div>

            {/* ROW 2: Collapsible Filter Panel (Hidden on Mobile unless toggled, Always visible on Desktop) */}
            <div className={`flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'flex max-h-[500px] opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100 md:flex'}`}>

              <div className="p-4 bg-white/[0.03] rounded-3xl border border-white/5 backdrop-blur-sm flex flex-col gap-4">

                {/* A. CATEGORY PILLS */}
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setSelectedCategory("ALL")}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedCategory === "ALL"
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-gray-500 border-transparent hover:bg-white/5"
                      }`}
                  >
                    All
                  </button>
                  {/* Separator */}
                  <div className="w-px h-8 bg-white/10 mx-2 hidden md:block"></div>

                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${isActive
                            ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20"
                            : "bg-white/5 border-white/5 text-gray-400 hover:border-pink-500/30 hover:text-white"
                          }`}
                      >
                        {/* IF ACTIVE SHOW 'X' TO CLOSE, ELSE SHOW ICON */}
                        {isActive ? <X size={14} /> : <Icon size={14} />}
                        {cat.label}
                      </button>
                    )
                  })}
                </div>

                {/* B. PRICE TOGGLES */}
                <div className="flex justify-center border-t border-white/5 pt-4">
                  <div className="inline-flex gap-2">
                    {["FREE", "PAID"].map((type) => {
                      const isActive = priceFilter === type;
                      return (
                        <button
                          key={type}
                          onClick={() => handlePriceClick(type)}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${isActive
                              ? "bg-white text-black border-white"
                              : "bg-transparent text-gray-500 border-white/10 hover:border-white/30"
                            }`}
                        >
                          {isActive && <X size={10} />}
                          {type} Only
                        </button>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </header>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-20 text-center rounded-[3rem] border border-dashed border-white/10">
              <ShieldAlert size={40} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs">No Events Match</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCategory("ALL"); setPriceFilter("ALL"); }} className="mt-4 text-pink-500 text-[10px] font-bold uppercase tracking-widest underline">
                Reset Filters
              </button>
            </div>
          ) : (
            filteredEvents.map(event => (
              <div
                key={event.id}
                className="group relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04] hover:border-pink-500/20 shadow-2xl overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-2">
                      <span className={`w-fit text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-lg italic ${event.category === 'PANACHE' ? 'bg-purple-500 shadow-purple-500/20' :
                          event.category === 'PRAGATI' ? 'bg-cyan-500 shadow-cyan-500/20' :
                            'bg-pink-500 shadow-pink-500/20'
                        }`}>
                        {event.category}
                      </span>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        <Calendar size={12} className="text-pink-500" />
                        {event.dateLabel || "TBA"}
                      </div>
                    </div>
                    {!event.allowOutside && (
                      <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1 rounded text-[8px] font-black text-red-500 border border-red-500/10">
                        <Zap size={10} fill="currentColor" /> VGU
                      </div>
                    )}
                  </div>

                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-3 leading-[0.9] group-hover:text-pink-500 transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-gray-500 text-[11px] font-medium leading-relaxed mb-2 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="mb-4">
                    <button
                      onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                      className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-pink-500/60 hover:text-pink-500 transition-all"
                    >
                      {expandedEvent === event.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {expandedEvent === event.id ? "Close Rules" : "Read Rulebook"}
                    </button>

                    {expandedEvent === event.id && (
                      <div className="mt-4 p-5 bg-black/40 rounded-2xl border border-white/5 animate-in slide-in-from-top duration-300">
                        <div className="space-y-3">
                          {event.guidelines?.map((rule, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div className="w-1 h-1 rounded-full bg-pink-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(236,72,153,1)]"></div>
                              <p className="text-[10px] text-gray-400 font-medium leading-normal italic">{rule}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative  z-10 pt-3 border-t border-white/5 flex flex-col gap-6">
                  <div className="flex mx-auto items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={14} className="text-pink-500/50" />
                      <span className="text-[11px] font-black uppercase tracking-widest">{event.minPlayers}-{event.maxPlayers} Players</span>
                    </div>
                    {event.eventPrice > 0 && !isVgu ? (
                      <div className="flex items-center gap-1 text-gray-400">
                        <IndianRupee size={14} className="text-pink-500/50" />
                        <span className="text-[15px] font-black uppercase tracking-widest">
                          {event.eventPrice}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-[11px] font-black uppercase tracking-widest text-green-500">FREE</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/register/${event.id}?isVgu=${isVgu}`)}
                    className="w-full bg-white text-black py-4 rounded-xl font-extrabold uppercase text-[12px] tracking-[0.2em] transition-all hover:bg-pink-500 hover:text-white shadow-xl active:scale-[0.98] group-hover:shadow-pink-500/10"
                  >
                    Start Registration
                  </button>
                </div>

                <Rocket className="absolute -bottom-10 -right-10 w-32 h-32 text-white/[0.02] -rotate-12 group-hover:scale-110 group-hover:text-pink-500/[0.03] transition-all duration-700" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsExplorer;