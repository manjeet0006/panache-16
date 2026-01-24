import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Users, ShieldAlert, Rocket, Calendar,
  ChevronDown, ChevronUp, BookOpen, MapPin, Star,
  Search, Zap, Sparkles,
  IndianRupee
} from 'lucide-react';
import API from '../api';

const EventsExplorer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isVgu = searchParams.get('isVgu') === 'true';
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get(`/register/list-events?isVgu=${isVgu}`);

        console.log(res);
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [isVgu]);

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-2 border-pink-500/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-pink-500 rounded-full animate-spin"></div>
      </div>
      <p className="mt-8 text-white font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Database</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white m-5 pb-32 relative selection:bg-pink-500/30">

      {/* Background Atmosphere */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <header className="mb-20 pt-16 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-xl group cursor-default">
            <Sparkles size={14} className="text-pink-500 group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Panache Era 2026 Lineup</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic leading-none mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">Event</span>
            <br />
            <span className="text-pink-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]">Explorer</span>
          </h1>

          <div className="relative max-w-xl mx-auto mt-12 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-pink-500/40 focus:bg-white/[0.06] transition-all backdrop-blur-md"
            />
          </div>
        </header>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-40 text-center rounded-[3rem] border border-dashed border-white/10">
              <ShieldAlert size={40} className="mx-auto text-gray-700 mb-6" />
              <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs">No Events Found In This Sector</p>
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
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col gap-2">
                      <span className="w-fit bg-pink-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-lg shadow-pink-500/20 italic">
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

                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 leading-[0.9] group-hover:text-pink-500 transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-gray-500 text-[11px] font-medium leading-relaxed mb-8 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Expandable Guidelines */}
                  <div className="mb-8">
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

                <div className="relative z-10 pt-6 border-t border-white/5 flex flex-col gap-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={14} className="text-pink-500/50" />
                      <span className="text-[11px] font-black uppercase tracking-widest">{event.minPlayers}-{event.maxPlayers} Players</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={14} className="text-pink-500/50" />
                      <span className="text-[11px] font-black uppercase tracking-widest">Jaipur</span>
                    </div>
                    {event.eventPrice >= 1 && !isVgu && (
                      <div className="flex items-center gap-1 pl-5 text-gray-400">
                        <IndianRupee size={14} className="text-pink-500/50" />
                        <span className="text-[15px] font-black uppercase tracking-widest">
                          {event.eventPrice}
                        </span>
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

                {/* Background Rocket Icon */}
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