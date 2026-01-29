// src/pages/ConcertBooking.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { toast } from 'sonner';

import API from '../api';

// FIX: Corrected path from 'hoooks' to 'hooks'


import TicketModal from '../components/TicketModal'; // Adjusted based on standard structure
import SuccessView from '@/components/concert/SuccessView';
import BookingForm from '@/components/concert/BookingForm';
import ArtistShowcase from '@/components/concert/ArtistShowcase';
import useRazorpay from '@/hooks/useRazorpay';

const ConcertBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { displayRazorpay } = useRazorpay();
    const containerRef = useRef(null);
    
    const [concert, setConcert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTier, setSelectedTier] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [purchasedTicket, setPurchasedTicket] = useState(null);
    const [modalType, setModalType] = useState(null);

    const { scrollYProgress } = useScroll({ target: containerRef });
    const yText = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

    useEffect(() => {
        const fetchConcert = async () => {
            try {
                const res = await API.get(`/concert/${id}`); 
                const found = res.data;
                if (found) {
                    setConcert(found);
                    const firstAvailableTier = found.tierDetails?.find(t => !t.soldOut);
                    setSelectedTier(firstAvailableTier);
                } else {
                    toast.error("Event not found");
                    navigate('/concerts');
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load details.");
            } finally {
                setLoading(false);
            }
        };
        fetchConcert();
    }, [id, navigate]);

    const handleBuy = async () => {
        if (!formData.name || !formData.email || !formData.phone) return toast.error("Please fill details.");
        if (!selectedTier) return toast.error("Select a tier.");

        setIsProcessing(true);
        displayRazorpay({
            amount: selectedTier.price,
            details: { ...formData, concertId: concert.id, tier: selectedTier.tier },
            onSuccess: async (response) => {
                try {
                    toast.loading("Securing spot...");
                    const res = await API.post('/concert/verify', {
                        ...response, ...formData, concertId: concert.id, tier: selectedTier.tier, price: selectedTier.price
                    });
                    toast.dismiss();
                    setPurchasedTicket(res.data.ticket);
                } catch (error) {
                    toast.dismiss();
                    toast.error("Generation failed.");
                } finally { setIsProcessing(false); }
            },
            onError: () => setIsProcessing(false)
        });
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-pink-500" /></div>;

    // Safety check: Ensure concert exists before rendering children
    if (!concert) return null;

    if (purchasedTicket) {
        return (
            <>
                <SuccessView ticket={purchasedTicket} concert={concert} onOpenGate={() => setModalType('GATE')} onOpenArena={() => setModalType('CONCERT')} />
                {modalType && (
                    <TicketModal 
                        ticket={{...purchasedTicket, concert: concert}} 
                        type={modalType} // Simplified
                        onClose={() => setModalType(null)} 
                    />
                )}
            </>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-[#020202] text-white font-sans selection:bg-pink-500 overflow-x-hidden relative">
            
            {/* GLOBAL BACKGROUND LAYER */}
            <motion.div style={{ opacity }} className="fixed inset-0 z-0 pointer-events-none">
                <img 
                    src={concert.imageUrl || "https://images.unsplash.com/photo-1470229722913-7ea995968f55?q=80&w=2670&auto=format&fit=crop"} 
                    alt="" 
                    className="w-full h-full object-cover grayscale brightness-[0.25]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
            </motion.div>

            {/* GIANT PARALLAX TEXT (Safe Check Added) */}
            <div className="fixed inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none z-0 overflow-hidden">
                <motion.h2 style={{ y: yText }} className="text-[35vw] font-black uppercase italic leading-none whitespace-nowrap">
                    {concert.artistName ? concert.artistName.split(' ')[0] : 'EVENT'}
                </motion.h2>
            </div>

            {/* OVERLAYS */}
            <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03] bg-noise mix-blend-overlay" />
            <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            {/* HEADER */}
            <header className="relative z-[50] p-8 flex items-center gap-6">
                <button onClick={() => navigate('/concerts')} className="p-3 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all border border-white/10 backdrop-blur-md">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-pink-500 mb-0.5 italic">Terminal 26</p>
                    <h1 className="text-xl font-black uppercase italic tracking-tighter text-white">
                        {concert.artistName}
                    </h1>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <ArtistShowcase concert={concert} />
                <BookingForm
                    formData={formData}
                    setFormData={setFormData}
                    tiers={concert.tierDetails}
                    selectedTier={selectedTier}
                    setSelectedTier={setSelectedTier}
                    onBuy={handleBuy}
                    isProcessing={isProcessing}
                    concertSoldOut={concert.soldOut}
                />
            </div>

            <style>{`
                .text-outline { -webkit-text-stroke: 1.5px white; }
                .bg-noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
            `}</style>
        </div>
    );
};

export default ConcertBooking;