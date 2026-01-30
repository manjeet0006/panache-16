import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Calendar, MapPin, Loader2, 
  Ticket, Volume2, Share2, Info, Sparkles,
  Music, Mic2, Star, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const ConcertShowcase = () => {
    const navigate = useNavigate();
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeArtist, setActiveArtist] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await API.get('/concert/all');
                console.log(res.data);
                setConcerts(res.data);
            } catch (err) {
                console.error("Failed to load lineup", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
                <Loader2 className="text-pink-500 animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div className="bg-black text-white font-sans overflow-x-hidden selection:bg-pink-500">
            {/* BACKGROUND OVERLAYS */}
            <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.03] bg-noise mix-blend-overlay" />
            <div className="fixed inset-0 pointer-events-none z-[998] opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            {/* PROGRESS TRACKER (Desktop Only) */}
            <div className="fixed left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-10">
                {concerts.map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <span className={`text-[8px] font-black transition-colors ${activeArtist === i ? 'text-pink-500' : 'text-gray-700'}`}>0{i+1}</span>
                        <div className={`w-[2px] h-10 rounded-full transition-all duration-500 ${activeArtist === i ? 'bg-pink-500 h-16' : 'bg-gray-800'}`} />
                    </div>
                ))}
            </div>

            {/* HERO */}
            <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <Sparkles className="text-pink-500" size={16} />
                        <span className="text-[12px] font-black tracking-[0.6em] uppercase text-gray-400 italic">Experience The Unseen</span>
                    </div>
                    <h1 className="text-[14vw] md:text-[16vw] leading-[0.75] font-black italic tracking-tighter uppercase mb-6">
                        STAR<br /><span className="text-outline text-transparent">NIGHTS</span>
                    </h1>
                </motion.div>
            </section>

            {/* ARTIST SECTIONS */}
            <main className="relative">
                {concerts.map((concert, index) => (
                    <ArtistSection 
                        key={concert.id} 
                        concert={concert} 
                        index={index}
                        totalConcerts={concerts.length}
                        onBook={() => navigate(`/concerts/book/${concert.id}`)}
                        onInView={() => setActiveArtist(index)}
                    />
                ))}
            </main>

            {/* FOOTER */}
            <section className="relative h-[50vh] flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1e1e,transparent)]" />
                <h2 className="relative z-10 text-4xl md:text-8xl font-black italic uppercase mb-8 text-center px-4">
                    Don't Miss <br /><span className="text-pink-600">The Magic</span>
                </h2>
                <button className="relative z-10 px-10 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-pink-500 hover:text-white transition-all hover:scale-105">
                    Secure All Access Pass
                </button>
            </section>

            <style>{`
                .text-outline { -webkit-text-stroke: 1.5px white; }
                .bg-noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
            `}</style>
        </div>
    );
};

const ArtistSection = ({ concert, index, totalConcerts, onBook, onInView }) => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    
    // Desktop Parallax only
    const yFocal = useTransform(scrollYProgress, [0, 1], [50, -50]);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) onInView(); }, { threshold: 0.5 });
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [onInView]);

    const prices = concert.tierDetails?.map(tier => Number(tier.price));
    const minPrice = prices && prices.length > 0 ? Math.min(...prices) : null;

    return (
        <section 
            ref={sectionRef} 
            // FIXED: Mobile = relative/min-h-screen | Desktop = sticky/h-screen
            className="relative lg:sticky lg:top-0 min-h-screen lg:h-screen w-full flex flex-col lg:flex-row items-center justify-center overflow-hidden border-b border-white/5 bg-black"
            style={{ zIndex: totalConcerts - index }}
        >
            
            {/* BACKGROUND IMAGE */}
            <motion.div style={{ scale: imgScale, opacity }} className="absolute inset-0 z-0">
                <img src={concert.imageUrl} alt="" className="w-full h-full object-cover grayscale brightness-[0.3]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
            </motion.div>

            {/* GIANT BACKGROUND TEXT */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
                <motion.h2 style={{ y: yText }} className="text-[35vw] font-black uppercase italic leading-none whitespace-nowrap">
                    {concert.artistName.split(' ')[0]}
                </motion.h2>
            </div>

            {/* DESKTOP FLOATING IMAGE (Hidden on Mobile) */}
            <motion.div 
                style={{ y: yFocal }} 
                className="absolute right-[10%] top-[15%] hidden lg:block z-10 w-[380px] h-[500px] pointer-events-none"
            >
                <div className="w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative">
                    <img src={concert.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                        {/* <div className="flex items-center gap-2 px-3 py-1 bg-pink-600 rounded-full">
                            <Camera size={12} className="text-white" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Official Lineup</span>
                        </div> */}
                    </div>
                </div>
            </motion.div>

            {/* CONTENT GRID */}
            <div className="relative z-20 w-full max-w-7xl px-6 py-20 lg:py-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center lg:items-end h-full lg:pb-24">
                
                {/* 1. TITLE SECTION (Mobile: Top, Desktop: Middle) */}
                <div className="lg:col-span-5 lg:order-2 text-center lg:text-left order-1">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 lg:mb-6">
                        <Mic2 size={16} className="text-pink-500" />
                        <span className="text-[12px] font-black uppercase tracking-[0.5em] text-gray-500">Headlining Act</span>
                    </div>

                    <h3 className="text-[15vw] sm:text-[12vw] lg:text-9xl font-black uppercase italic leading-[0.85] tracking-tighter mb-6 group">
                        {concert.artistName.split(' ')[0]} <br />
                        <span className="text-outline text-transparent group-hover:text-white transition-colors duration-500">
                            {concert.artistName.split(' ').slice(1).join(' ')}
                        </span>
                    </h3>

                    {/* MOBILE IMAGE (Mobile: Visible, Desktop: Hidden) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="block lg:hidden w-full aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mb-8 relative"
                    >
                         <img src={concert.imageUrl} alt="" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                         <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 bg-pink-600 rounded-full">
                            <Camera size={10} className="text-white" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white">Live Visuals</span>
                        </div>
                    </motion.div>
                </div>

                {/* 2. META INFO (Mobile: Middle, Desktop: Left) */}
                <div className="lg:col-span-4 lg:order-1 order-2 flex flex-col gap-6 lg:gap-8 items-center lg:items-start w-full">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center font-black italic text-xl lg:text-2xl text-pink-500">
                            0{index + 1}
                        </div>
                        <div className="text-left">
                            <p className="text-[11px] font-black uppercase text-pink-500 tracking-[0.4em] mb-1">{concert.dayLabel}</p>
                            <div className="flex items-center gap-2 text-white/50">
                                <Calendar size={12} />
                                <p className="text-[12px] font-bold uppercase tracking-widest">{new Date(concert.date).toDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto p-5 lg:p-6 border-l-2 border-pink-500 bg-white/5 backdrop-blur-sm rounded-r-2xl max-w-md lg:max-w-xs text-left">
                        <p className="text-[12px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">
                            Catch {concert.artistName} performing live at the VGU Main Arena. An exclusive night of electronic and visual storytelling.
                        </p>
                    </div>
                </div>

                {/* 3. PRICING (Mobile: Bottom, Desktop: Right) */}
                <div className="lg:col-span-3 lg:order-3 order-3 w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 lg:p-8 rounded-[2rem] shadow-2xl"
                    >
                        <p className="text-[12px] font-black text-gray-300 uppercase tracking-widest mb-4 flex items-center justify-between">
                            {minPrice ? 'Starts From' : 'Access Pass'} <Star size={10} className="text-yellow-500" />
                        </p>
                        <div className="mb-6 lg:mb-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl lg:text-5xl font-black italic tracking-tighter text-white">
                                    {minPrice ? `₹${minPrice}` : 'TBA'}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={onBook} 
                            disabled={!minPrice}
                            className="w-full py-4 lg:py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl flex items-center justify-center gap-3 hover:bg-pink-600 hover:text-white transition-all transform hover:scale-[1.05] disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {minPrice ? 'Get Tickets' : 'Coming Soon'} <Ticket size={16} />
                        </button>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default ConcertShowcase;