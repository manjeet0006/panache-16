import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, ShieldAlert, Rocket } from 'lucide-react'; // Icons for flair
import API from '../api';

const EventsExplorer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isVgu = searchParams.get('isVgu') === 'true';
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-t-pink-500 border-white/10 rounded-full animate-spin"></div>
      <p className="mt-4 text-pink-500 font-bold tracking-widest uppercase animate-pulse text-sm">Loading Panache Events</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="max-w-7xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
          <Rocket size={14} className="text-pink-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Choose Your Stage</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
          Event <span className="text-pink-500">Explorer</span>
        </h1>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto text-lg">
          {isVgu 
            ? "Exclusive access for VGU Students. Show your department pride." 
            : "Calling all innovators and performers from across the country."}
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
            <ShieldAlert size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest">No events found for this category</p>
          </div>
        ) : (
          events.map(event => (
            <div 
              key={event.id} 
              className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.08] hover:border-pink-500/50 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              {/* Card Decoration */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-pink-500/10 blur-3xl group-hover:bg-pink-500/20 transition-all"></div>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-pink-500/10 text-pink-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-pink-500/20">
                    {event.category}
                  </span>
                  {!event.allowOutside && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                      VGU Internal
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 leading-tight group-hover:text-pink-500 transition-colors">
                  {event.name}
                </h3>
                <p className="text-gray-400 text-sm font-medium line-clamp-3 leading-relaxed mb-6">
                  {event.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Users size={16} />
                    <span className="text-xs font-bold uppercase tracking-tighter">{event.minPlayers} - {event.maxPlayers} Players</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/register/${event.id}?isVgu=${isVgu}`)}
                  className="w-full bg-white text-black font-black uppercase tracking-tighter py-4 rounded-xl group-hover:bg-gradient-to-r from-pink-500 to-purple-600 group-hover:text-white transition-all duration-300 shadow-xl"
                >
                  Register Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsExplorer;