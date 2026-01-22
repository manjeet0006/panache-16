import React from 'react';
import { CheckCircle, Trophy, Home, Share2, Calendar } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const SuccessScreen = ({ data, eventName, isVgu, onHome }) => {
  const teamName = data?.team?.name || "Team";
  const ticketId = data?.ticket?.id;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center backdrop-blur-xl animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        
        {/* Background Accent Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/10 blur-[80px] pointer-events-none" />

        <CheckCircle className="text-green-400 mx-auto mb-4" size={64} />
        
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2 text-white">
          Registration <span className="text-pink-500">Done!</span>
        </h2>

        <div className="space-y-1 mb-8">
          <p className="text-gray-400 text-sm leading-relaxed">
            Congratulations <span className="text-white font-bold">{teamName}</span>!
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-bold">
            Confirmed for {eventName}
          </p>
        </div>

        {/* --- CONDITIONAL UI BLOCK --- */}
        {isVgu ? (
          /* INSIDER VIEW: VGU Internal Confirmation Card */
          <div className="bg-pink-500/10 border border-pink-500/20 rounded-3xl p-8 mb-6 animate-in slide-in-from-bottom-4 duration-700">
            <Trophy className="text-pink-500 mx-auto mb-3" size={40} />
            <h3 className="text-lg font-black uppercase italic text-white mb-1">Internal Slot Secured</h3>
            <p className="text-[10px] text-pink-300/60 uppercase font-bold tracking-widest">
              Verified via Department Code
            </p>
            <div className="mt-4 pt-4 border-t border-pink-500/10">
              <p className="text-[11px] text-gray-400 italic">
                "No QR needed. Please carry your VGU Student ID card for entry verification at the venue."
              </p>
            </div>
          </div>
        ) : (
          /* OUTSIDER VIEW: QR Ticket Display */
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-5 rounded-[2rem] inline-block mb-2 shadow-[0_0_50px_rgba(255,255,255,0.1)] border-4 border-pink-500/20">
              <QRCodeCanvas 
                value={ticketId || "PENDING"} 
                size={180}
                level={"H"}
                includeMargin={true}
              />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl py-3 px-4 inline-block">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Ticket ID</p>
              <p className="text-sm font-mono font-bold text-pink-500">{ticketId}</p>
            </div>
            <p className="text-[10px] text-gray-500 italic max-w-[250px] mx-auto">
              Save this QR code. It will be scanned at the main gate for entry.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <button 
            onClick={onHome} 
            className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-black uppercase text-xs hover:bg-pink-500 hover:text-white transition-all group"
          >
            <Home size={16} /> Home
          </button>
          <button 
            onClick={() => window.print()} 
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-white/10 transition-all"
          >
            <Share2 size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;