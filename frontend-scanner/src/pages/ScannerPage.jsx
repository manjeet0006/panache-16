import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Users, ShieldCheck, ScanLine, ChevronLeft, 
  WifiOff, Server, RefreshCw, XCircle, CheckCircle2, Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION ---
const SCAN_DELAY = 2500; 
const ERROR_DELAY = 2000; 
const FPS = 10; // Lower FPS is more stable on mobile browsers

// --- AUDIO SETUP ---
const successAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
const errorAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/954/954-preview.mp3');
successAudio.volume = 0.5;
errorAudio.volume = 0.6;

const ScannerPage = ({ socket }) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [scannerId, setScannerId] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [teamDetails, setTeamDetails] = useState(null);
  const [isSystemReady, setIsSystemReady] = useState(false); 
  const [isConnected, setIsConnected] = useState(socket?.connected || false);
  const [cameraError, setCameraError] = useState(null);

  // Refs
  const scannerRef = useRef(null); // Stores the Html5Qrcode instance
  const resetTimerRef = useRef(null);
  const isScanningRef = useRef(false); // Track if camera is actively running

  console.log(teamDetails);

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const playFeedback = (type) => {
    const sound = type === 'success' ? successAudio : errorAudio;
    sound.currentTime = 0;
    sound.play().catch((err) => console.warn("Audio blocked:", err));

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (type === 'success') navigator.vibrate(70); 
      else navigator.vibrate([50, 50, 50]); 
    }
  };

  const handleReset = () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    setLastScan(null);
    setTeamDetails(null);
    setIsProcessing(false);
    
    // Resume scanning if instance exists
    if (scannerRef.current && isScanningRef.current) {
      try { scannerRef.current.resume(); } catch (e) { /* ignore */ }
    }
  };

  const handleInitialize = (gateType) => {
    // Prime audio on user interaction to bypass browser autoplay policy
    successAudio.play().then(() => { 
        successAudio.pause(); 
        successAudio.currentTime = 0; 
    }).catch(() => { });
    
    setScannerId(gateType);
    setIsUnlocked(true);
    setCameraError(null);
  };

  // ---------------------------------------------------------------------------
  // SOCKET & EVENTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => { setIsConnected(true); toast.dismiss('connection-status'); };
    const handleDisconnect = () => {
      setIsConnected(false); setIsSystemReady(false);
      toast.error("Offline. Reconnecting...", { id: 'connection-status', duration: Infinity, icon: <WifiOff size={16} /> });
    };
    const handleSystemStatus = ({ isReady }) => {
      setIsSystemReady(isReady);
      if (!isReady) toast.loading("System Hydrating...", { id: 'warmup-status', duration: Infinity, icon: <Server size={16} className="animate-pulse"/> });
      else toast.dismiss('warmup-status');
    };
    const handleSystemReady = () => {
      setIsSystemReady(true); toast.dismiss('warmup-status'); toast.success("System Ready", { duration: 2000 }); 
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("SYSTEM_STATUS", handleSystemStatus); 
    socket.on("SYSTEM_READY", handleSystemReady);   

    if (!socket.connected) handleDisconnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("SYSTEM_STATUS", handleSystemStatus);
      socket.off("SYSTEM_READY", handleSystemReady);
      toast.dismiss('connection-status');
      toast.dismiss('warmup-status');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleScanSuccess = (data) => {
      setLastScan(data); playFeedback('success');
      resetTimerRef.current = setTimeout(handleReset, SCAN_DELAY);
    };
    const handleScanError = (data) => {
      setLastScan({ error: data.error, isError: true }); playFeedback('error');
      resetTimerRef.current = setTimeout(handleReset, ERROR_DELAY);
    };
    const handleTeamDetails = (data) => {
      if (scannerId === 'CELEBRITY_GATE') {
        setLastScan({ error: "Invalid at Celebrity Gate", isError: true }); playFeedback('error');
        resetTimerRef.current = setTimeout(handleReset, SCAN_DELAY);
      } else {
        setTeamDetails(data); playFeedback('success'); setIsProcessing(false);
      }
    };
    const handleMemberLogSuccess = ({ action, memberName }) => { toast.success(`${action}: ${memberName}`); };
    const handleTeamMembersUpdated = ({ teamId, members }) => {
      setTeamDetails(current => (current && current.teamId === teamId ? { ...current, members } : current));
    };

    socket.on("SCAN_SUCCESS", handleScanSuccess);
    socket.on("SCAN_ERROR", handleScanError);
    socket.on("SCAN_TEAM_DETAILS", handleTeamDetails);
    socket.on("MEMBER_LOG_SUCCESS", handleMemberLogSuccess);
    socket.on("TEAM_MEMBERS_UPDATED", handleTeamMembersUpdated);

    return () => {
      socket.off("SCAN_SUCCESS", handleScanSuccess);
      socket.off("SCAN_ERROR", handleScanError);
      socket.off("SCAN_TEAM_DETAILS", handleTeamDetails);
      socket.off("MEMBER_LOG_SUCCESS", handleMemberLogSuccess);
      socket.off("TEAM_MEMBERS_UPDATED", handleTeamMembersUpdated);
    };
  }, [socket, handleReset, scannerId]);

  // ---------------------------------------------------------------------------
  // SCANNER LIFECYCLE (THE CRITICAL FIX)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isUnlocked) return;

    // Use Html5Qrcode class (Pro API) directly for better control
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    const startCamera = async () => {
      try {
        // Calculate dynamic QR box size based on screen
        const qrBoxSize = Math.min(window.innerWidth, window.innerHeight) * 0.7;

        await html5QrCode.start(
          { facingMode: "environment" }, // FORCE BACK CAMERA
          {
            fps: FPS,
            qrbox: { width: qrBoxSize, height: qrBoxSize },
            aspectRatio: 1.0, 
            disableFlip: false,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
          },
          (decodedText) => {
            console.log(decodedText , "ticket");
             // SUCCESS CALLBACK
             handleScan(decodedText);
          },
          (errorMessage) => {
             // Scanning... (ignore errors frame-by-frame)
          }
        );
        isScanningRef.current = true;
      } catch (err) {
        console.error("Camera Start Error:", err);
        setCameraError("Camera Permission Denied or Not Available. Please ensure you are using HTTPS.");
        isScanningRef.current = false;
      }
    };

    // Tiny delay to ensure DOM is painted
    const timer = setTimeout(startCamera, 300);

    return () => {
        clearTimeout(timer);
        if (scannerRef.current && isScanningRef.current) {
            scannerRef.current.stop().then(() => {
                scannerRef.current.clear();
                isScanningRef.current = false;
            }).catch(err => console.error("Stop failed", err));
        }
    };
  }, [isUnlocked]);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------
  const handleScan = (decodedText) => {
    // 1. Validation
    if (!isConnected || !isSystemReady) { 
        toast.warning("System Offline/Loading"); 
        return; 
    }
    if (isProcessing) return;
    
    // 2. Lock State
    setIsProcessing(true); 
    setLastScan(null); 
    setTeamDetails(null);
    
    // 3. Pause Scanner (Visual Feedback)
    if (scannerRef.current && isScanningRef.current) {
        try { scannerRef.current.pause(); } catch (e) {}
    }

    console.log(decodedText);
    // 4. Emit
    if (socket) {
        socket.emit("VERIFY_SCAN", { ticketCode: decodedText, scannerId: scannerId });
    } else { 
        setIsProcessing(false); 
        handleReset(); 
    }
  };

  const handleLogMember = (member) => {
    if (!socket) return;
    socket.emit("TOGGLE_MEMBER_STATUS", { 
        teamId: teamDetails.teamId, 
        memberId: member.id, 
        memberName: member.name, 
        scannerId: scannerId 
    });
  };

  // ---------------------------------------------------------------------------
  // VIEW: LOCKED STATE
  // ---------------------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-[#050505] p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a,transparent)] opacity-40 pointer-events-none" />
        <div className="text-center z-10 mb-12">
            <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                <ScanLine size={32} className="text-pink-500" />
            </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
            Gate<span className="text-pink-500">Keeper</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Mobile & Desktop Terminal</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl z-10 px-4">
          <button onClick={() => handleInitialize('MAIN_GATE')} className="flex-1 group relative bg-blue-900/10 border border-blue-500/20 hover:bg-blue-600/20 p-8 rounded-3xl flex items-center gap-6 transition-all">
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><Users size={28} /></div>
            <div className="text-left"><h2 className="text-2xl font-black uppercase italic text-white">Main Gate</h2><p className="text-xs font-bold text-blue-300 uppercase tracking-widest">Students & Teams</p></div>
          </button>
          <button onClick={() => handleInitialize('CELEBRITY_GATE')} className="flex-1 group relative bg-pink-900/10 border border-pink-500/20 hover:bg-pink-600/20 p-8 rounded-3xl flex items-center gap-6 transition-all">
            <div className="w-14 h-14 bg-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20"><ShieldCheck size={28} /></div>
            <div className="text-left"><h2 className="text-2xl font-black uppercase italic text-white">VIP Gate</h2><p className="text-xs font-bold text-pink-300 uppercase tracking-widest">Celebrity Access</p></div>
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW: SCANNER INTERFACE
  // ---------------------------------------------------------------------------
  const gateColor = scannerId === 'MAIN_GATE' ? 'text-blue-500' : 'text-pink-500';
  const gateBg = scannerId === 'MAIN_GATE' ? 'bg-blue-500' : 'bg-pink-500';

  return (
    <div className="h-dvh bg-[#050505] text-white flex flex-col md:flex-row relative overflow-hidden font-sans">
      
      {/* LEFT COLUMN: Camera + Header */}
      <div className="w-full md:w-1/2 h-dvh md:h-full flex flex-col p-4 md:p-6 gap-6 relative z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between shrink-0 px-2">
            <div className="flex items-center gap-4">
                <button onClick={() => { setIsUnlocked(false); setScannerId(null); }} className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h2 className="text-sm font-black uppercase italic tracking-tighter leading-none">
                        Scanner <span className={gateColor}>Active</span>
                    </h2>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                        {!isConnected ? <span className="text-red-500">OFFLINE</span> : 
                         !isSystemReady ? <span className="text-yellow-500">LOADING</span> : 
                         <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> ONLINE</>}
                    </p>
                </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${scannerId === 'MAIN_GATE' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-pink-500/10 border-pink-500/20 text-pink-400'}`}>
                {scannerId === 'MAIN_GATE' ? 'MAIN' : 'VIP'}
            </div>
          </div>

          {/* Camera Container */}
          <div className="flex-1 flex items-center justify-center relative w-full">
             
             {/* THE CAMERA CARD */}
             <div className="relative w-full max-w-sm md:max-w-md aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black">
                 
                 {/* ERROR STATE */}
                 {cameraError && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
                        <Camera size={40} className="text-red-500 mb-4" />
                        <p className="text-red-400 font-bold uppercase tracking-widest text-xs mb-2">Camera Error</p>
                        <p className="text-gray-400 text-xs">{cameraError}</p>
                    </div>
                 )}

                 {/* 1. ACTUAL SCANNER MOUNT */}
                 {/* We force the ID div to fill the container */}
                 <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                    <div id="reader" className="w-full h-full" />
                 </div>

                 {/* 2. OVERLAY UI (Centered) */}
                 <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                      <div className={`w-[75%] aspect-square max-w-[300px] border-2 border-dashed ${scannerId === 'MAIN_GATE' ? 'border-blue-500/30' : 'border-pink-500/30'} rounded-3xl relative shadow-[0_0_100px_rgba(0,0,0,0.5)]`}>
                           <div className={`absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 ${scannerId === 'MAIN_GATE' ? 'border-blue-500' : 'border-pink-500'} rounded-tl-xl`}/>
                           <div className={`absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 ${scannerId === 'MAIN_GATE' ? 'border-blue-500' : 'border-pink-500'} rounded-tr-xl`}/>
                           <div className={`absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 ${scannerId === 'MAIN_GATE' ? 'border-blue-500' : 'border-pink-500'} rounded-bl-xl`}/>
                           <div className={`absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 ${scannerId === 'MAIN_GATE' ? 'border-blue-500' : 'border-pink-500'} rounded-br-xl`}/>
                           
                           {/* Laser */}
                           {!isProcessing && isConnected && isSystemReady && !cameraError && (
                               <div className={`absolute left-2 right-2 h-0.5 ${gateBg} shadow-[0_0_15px_currentColor] animate-scan top-1/2`} />
                           )}
                      </div>
                 </div>

                 {/* 3. LOADER */}
                 {(isProcessing || !isConnected || !isSystemReady) && !cameraError && (
                     <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                         <div className="flex flex-col items-center gap-3">
                             <RefreshCw className={`animate-spin ${gateColor}`} size={32} />
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                 {isProcessing ? 'Verifying...' : 'System Init...'}
                             </p>
                         </div>
                     </div>
                 )}
             </div>
          </div>
      </div>

      {/* RIGHT COLUMN: Results */}
      <div className={`
          z-50 bg-[#0a0a0a] flex flex-col transition-all duration-300
          ${(teamDetails || lastScan) ? 'fixed inset-0 md:relative md:inset-auto md:w-1/2 md:h-full' : 'hidden md:flex md:relative md:inset-auto md:w-1/2 md:h-full'}
      `}>
          <AnimatePresence mode="wait">
            {teamDetails ? (
                <motion.div key="team" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                    <div className="p-6 bg-gradient-to-b from-blue-900/20 to-transparent border-b border-white/10 shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"><Users size={24} className="text-white" /></div>
                                <div><p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Verified</p><h2 className="text-2xl font-black uppercase italic leading-none text-white truncate max-w-[200px] md:max-w-[300px]">{teamDetails.teamName}</h2></div>
                            </div>
                            <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white">{teamDetails.members.filter(m => m.status === 'ENTRY').length} / {teamDetails.members.length} IN</div>
                        </div>
                        <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest bg-white/5 py-2 rounded-lg">Tap member to Toggle Entry/Exit</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 md:pb-4">
                        {teamDetails.members.map((member, i) => {
                            const isEntered = member.status === 'ENTRY';
                            return (
                                <button key={member.id} onClick={() => handleLogMember(member)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.98] ${isEntered ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                    <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isEntered ? 'bg-green-500 text-black' : 'bg-white/10 text-gray-500'}`}>{i + 1}</div><span className={`text-sm font-bold uppercase text-left truncate max-w-[140px] md:max-w-xs ${isEntered ? 'text-white' : 'text-gray-400'}`}>{member.name}</span></div>
                                    <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${isEntered ? 'bg-green-500 text-black' : 'bg-white/10 text-gray-500'}`}>{isEntered ? 'INSIDE' : 'OUT'}</div>
                                </button>
                            )
                        })}
                    </div>
                    <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 mt-auto"><button onClick={handleReset} className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-gray-200"><RefreshCw size={16} /> Complete & Next</button></div>
                </motion.div>
            ) : lastScan ? (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`flex flex-col h-full items-center justify-center p-8 text-center ${lastScan.isError ? 'bg-red-950/20' : 'bg-green-950/20'}`}>
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 border-4 ${lastScan.isError ? 'bg-red-500 border-red-400' : 'bg-green-500 border-green-400'} shadow-2xl`}>
                        {lastScan.isError ? <XCircle size={64} className="text-white" /> : <CheckCircle2 size={64} className="text-white" />}
                    </div>
                    <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4 text-white">{lastScan.isError ? "Denied" : "Approved"}</h2>
                    <div className="bg-white/5 border border-white/10 px-8 py-2 rounded-full mb-8"><p className={`text-xs font-bold uppercase tracking-widest ${lastScan.isError ? 'text-red-400' : 'text-green-400'}`}>{lastScan.message || lastScan.error}</p></div>
                    {lastScan.teamName && (<div className="mb-12"><p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 text-white">Ticket Holder</p><p className="text-3xl font-black uppercase text-white">{lastScan.teamName}</p></div>)}
                    <button onClick={handleReset} className="w-full max-w-sm py-5 bg-white text-black rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-colors">Scan Next</button>
                </motion.div>
            ) : (
                <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-12 opacity-30">
                    <ScanLine size={64} className="mb-6" />
                    <h3 className="text-2xl font-black uppercase italic">Ready to Scan</h3>
                    <p className="text-sm font-bold uppercase tracking-widest mt-2">Point camera at a Ticket QR Code</p>
                </div>
            )}
          </AnimatePresence>
      </div>

      <style>{`
        /* Force video to fill container */
        #reader video { 
            object-fit: cover !important; 
            width: 100% !important; 
            height: 100% !important; 
            border-radius: 0 !important;
        }
        @keyframes scan { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .animate-scan { animation: scan 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default ScannerPage;