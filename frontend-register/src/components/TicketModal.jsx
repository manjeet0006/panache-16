import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import { X, Download, MapPin, Calendar, Zap, ShieldCheck, Music, Crown, Star, User, Loader2 } from 'lucide-react';

const TicketModal = ({ ticket, type, onClose }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    if (!ticket) return null;

    // --- 1. DATA NORMALIZATION ---
    const isTeam = Boolean(ticket.teamName);
    const isArena = type === 'CONCERT';

    // Normalize Tier (Handle both 'tier' and 'ticketTier' keys)
    const rawTier = ticket.tier || ticket.ticketTier || 'SILVER';
    const tier = rawTier.toUpperCase();

    // Safe Data Extraction based on your JSON structure
    const data = {
        name: isTeam ? ticket.teamName : ticket.guestName,
        eventName: isArena ? (ticket.concert?.artistName || "Star Night") : "Panache Entry",
        // Fix: Access date from concert object first, fallback to createdAt
        date: new Date(ticket.concert?.date || ticket.createdAt || Date.now()),
        // Fix: prioritize arenaCode for concerts
        code: isArena ? (ticket.arenaCode || ticket.concertCode) : (ticket.gateCode || ticket.ticketCode),
        venue: isArena ? "Main Arena" : "Gate 1"
    };

    // Format Date: "Feb 13"
    const dateDisplay = data.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // 2. HARDCODED COLORS (Safe for download)
    const colors = {
        white: '#ffffff',
        black: '#000000',
        gray200: '#e5e7eb',
        gray400: '#9ca3af',
        red400: '#B81C00',
        platinumText: '#cffafe',
    };

    // 3. THEMES
    const themes = {
        SILVER: {
            accent: '#94a3b8',
            border: '#e2e8f0',
            headerBg: '#18181b',
            icon: Zap,
            label: 'Standard Access',
            gradient: 'linear-gradient(90deg, #e2e8f0, #94a3b8)',
            shadow: '0 0 40px rgba(148,163,184,0.3)',
            buttonBg: '#1e293b',
            buttonText: '#ffffff'
        },
        GOLD: {
            accent: '#eab308',
            border: '#eab308',
            headerBg: '#422006',
            icon: Star,
            label: 'VIP Lounge',
            gradient: 'linear-gradient(90deg, #fde047, #eab308, #fef08a)',
            shadow: '0 0 60px rgba(234,179,8,0.4)',
            buttonBg: '#eab308',
            buttonText: '#000000'
        },
        PLATINUM: {
            accent: '#C69F62',
            border: '#C69F62',
            headerBg: '#020617',
            icon: Crown,
            label: 'Pro / Fan-Pit',
            gradient: 'linear-gradient(90deg, #E6C27A, #C69F62, #604D30)',
            shadow: '0 0 80px rgba(198,159,98,0.55)',
            buttonBg: 'linear-gradient(90deg, #C69F62, #604D30)',
            buttonText: '#ffffff'
        }
    };

    const theme = themes[tier] || themes.SILVER;
    const TierIcon = theme.icon;

    // --- DOWNLOAD HANDLER ---
    const handleDownload = async () => {
        setIsDownloading(true);
        await new Promise(resolve => setTimeout(resolve, 300));

        const element = document.getElementById('ticket-content');

        if (element) {
            try {
                const canvas = await html2canvas(element, {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: null,
                    logging: false,
                    onclone: (clonedDoc) => {
                        const clonedElement = clonedDoc.getElementById('ticket-content');
                        if (clonedElement) clonedElement.style.transform = 'none';
                    }
                });

                const link = document.createElement('a');
                link.download = `Panache_Ticket_${data.code}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                console.error("Download failed:", error);
                alert("Download failed. Please take a screenshot.");
            } finally {
                setIsDownloading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 pt-15 z-[100] flex justify-center bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300 font-sans">

            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>

            <div className="w-full h-full overflow-y-auto flex justify-center pt-20 pb-24 px-4">
                <div className="relative w-full max-w-[340px] flex flex-col my-auto">

                    {/* --- TICKET CONTAINER --- */}
                    <div
                        id="ticket-content"
                        className="rounded-[2.5rem] overflow-hidden flex-shrink-0"
                        style={{
                            backgroundColor: colors.white,
                            border: `2px solid ${tier === 'SILVER' ? 'transparent' : theme.border}`,
                            boxShadow: theme.shadow
                        }}
                    >

                        {/* HEADER */}
                        <div
                            className="p-6 pb-5 relative overflow-hidden"
                            style={{ backgroundColor: theme.headerBg }}
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: theme.gradient }}></div>

                            <div className="flex justify-between items-start mb-6">
                                <div
                                    className="flex items-center gap-2 px-2 py-1 rounded-full border backdrop-blur-md"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                                >
                                    <TierIcon size={12} style={{ color: tier === 'PLATINUM' ? '#22d3ee' : theme.accent }} />
                                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.accent }}>
                                        {tier} {theme.label}
                                    </span>
                                </div>
                            </div>

                            <h2
                                className="text-4xl font-black uppercase italic tracking-tighter leading-[0.85] mb-3 break-words"
                                style={{
                                    color: tier === 'PLATINUM' ? colors.platinumText : colors.white,
                                    textShadow: tier === 'PLATINUM' ? '0 0 15px rgba(34, 211, 238, 0.4)' : 'none'
                                }}
                            >
                                {data.eventName}
                            </h2>

                            <div className="flex items-start gap-3 mb-6">
                                <div className="p-1.5 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: theme.accent }}>
                                    {isTeam ? <User size={14} /> : <ShieldCheck size={14} />}
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest break-words leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                    {data.name}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div>
                                    <p className="text-[13px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Date</p>
                                    <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider" style={{ color: colors.white }}>
                                        <Calendar size={12} style={{ color: theme.accent }} /> {dateDisplay}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Venue</p>
                                    <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider" style={{ color: colors.white }}>
                                        <MapPin size={12} style={{ color: theme.accent }} /> {data.venue}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NOTCH */}
                        <div className="relative h-8 flex items-center justify-between" style={{ backgroundColor: colors.white }}>
                            <div className="w-4 h-8 rounded-r-full" style={{ backgroundColor: colors.black }}></div>
                            <div className="flex-1 border-b-2 border-dashed mx-2" style={{ borderColor: colors.gray200 }}></div>
                            <div className="w-4 h-8 rounded-l-full" style={{ backgroundColor: colors.black }}></div>
                        </div>

                        {/* BODY */}
                        <div className="px-6 pb-8 pt-2 flex flex-col items-center" style={{ backgroundColor: colors.white }}>
                            <div className="p-3 rounded-2xl mb-5 relative" style={{ backgroundColor: colors.white, border: `2px dashed ${colors.gray200}` }}>
                                <QRCode value={data.code || "NO_CODE"} size={160} fgColor={colors.black} bgColor={colors.white} level="H" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-10 h-10 rounded-md flex items-center justify-center shadow-sm" style={{ backgroundColor: colors.white, border: `2px solid ${colors.white}` }}>
                                        <div className="w-full h-full rounded-sm flex items-center justify-center" style={{ backgroundColor: colors.black }}>
                                            <span className="text-[10px] font-black" style={{ color: colors.white }}>P16</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: colors.gray400 }}>Scan to Verify</p>
                            <p className="text-xl font-black font-mono leading-none tracking-[0.3em]" style={{ color: colors.black }}>
                                {data.code}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-4" style={{ color: colors.gray400 }}>Non-Transferable</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: colors.red400 }}>One Time access Only</p>


                            {tier === 'PLATINUM' && (
                                <div className="mt-6 w-full py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: '#ecfeff', border: `1px solid rgba(34, 211, 238, 0.3)` }}>
                                    <Crown size={12} style={{ color: '#0891b2' }} />
                                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#155e75' }}>Priority Access Active</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CLOSE BUTTON */}
                    <button onClick={onClose} className="absolute -top-12 right-0 p-2 rounded-full hover:bg-white/20 transition-all text-white" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <X size={24} />
                    </button>

                    {/* DOWNLOAD BUTTON */}
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="w-full mt-6 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[13px] shadow-2xl flex items-center justify-center gap-3 transform active:scale-95 transition-all"
                        style={{ background: theme.buttonBg, color: theme.buttonText, opacity: isDownloading ? 0.7 : 1 }}
                    >
                        {isDownloading ? (
                            <><Loader2 size={18} className="animate-spin" /> Processing...</>
                        ) : (
                            <><Download size={18} /> Save Ticket</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketModal;