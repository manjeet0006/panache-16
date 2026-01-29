import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  LogIn, LogOut, UserCheck,
  CheckCircle2, XCircle, RefreshCw, Users, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

// Initialize audio objects (create them once)
const successAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
const errorAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/954/954-preview.mp3');
successAudio.volume = 0.5;
errorAudio.volume = 0.6;

const ScannerPage = ({ socket }) => {
  // --- STATE ---
  const [scannerId, setScannerId] = useState(null); // 'MAIN_GATE' or 'CELEBRITY_GATE'
  const [lastScan, setLastScan] = useState(null); // Result of the last scan
  const [teamDetails, setTeamDetails] = useState(null); // If a team code is scanned
  const [isProcessing, setIsProcessing] = useState(false); // Locking mechanism
  const [isUnlocked, setIsUnlocked] = useState(false); // Has user selected a gate?

  const scannerRef = useRef(null); // Ref to hold the scanner instance

  // --- AUDIO HELPER ---
  const playFeedback = (type) => {
    const sound = type === 'success' ? successAudio : errorAudio;
    sound.currentTime = 0;
    sound.play().catch((err) => console.warn("Audio play blocked:", err));
    
    if (navigator.vibrate) {
      navigator.vibrate(type === 'success' ? 70 : [150, 50, 150]);
    }
  };

  // --- SOCKET & SCANNER LOGIC ---
  useEffect(() => {
    // Only run if unlocked and socket is available
    if (!isUnlocked || !socket) return;

    // 1. Define Socket Handlers
    const handleScanSuccess = (data) => {
      setLastScan(data);
      playFeedback('success');
      toast.success(`${data.action}: ${data.teamName || 'Visitor'}`);
      
      // Auto-reset after delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    };

    const handleScanError = (data) => {
      setLastScan({ error: data.error, isError: true });
      playFeedback('error');
      toast.error(data.error);
      
      // Auto-reset after delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    };
    
    const handleTeamDetails = (data) => {
      setTeamDetails(data);
      playFeedback('success');
      toast.info(`Team Found: ${data.teamName}`);
      setIsProcessing(false); // Unlock to allow member selection
    };

    const handleMemberLogSuccess = ({ message }) => {
      toast.success(message);
      // Optional: Update local team state to show checked-in status if API returns it
    };

    // 2. Attach Listeners
    socket.on("SCAN_SUCCESS", handleScanSuccess);
    socket.on("SCAN_ERROR", handleScanError);
    socket.on("SCAN_TEAM_DETAILS", handleTeamDetails);
    socket.on("MEMBER_LOG_SUCCESS", handleMemberLogSuccess);

    // 3. Initialize Scanner
    // Clean up previous instance if exists
    if (scannerRef.current) {
        scannerRef.current.clear().catch(console.warn);
    }

    const qrcodeScanner = new Html5QrcodeScanner("reader", {
      fps: 10, // Lower FPS saves battery
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
      rememberLastUsedCamera: true
    }, false);

    qrcodeScanner.render(
      (text) => handleScan(text), 
      (err) => { /* Ignore scan errors */ }
    );
    
    scannerRef.current = qrcodeScanner;

    // 4. Cleanup Function
    return () => {
      socket.off("SCAN_SUCCESS", handleScanSuccess);
      socket.off("SCAN_ERROR", handleScanError);
      socket.off("SCAN_TEAM_DETAILS", handleTeamDetails);
      socket.off("MEMBER_LOG_SUCCESS", handleMemberLogSuccess);
      
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.warn);
        scannerRef.current = null;
      }
    };
  }, [socket, isUnlocked]); // Re-run if lock state changes

  // --- ACTIONS ---

  const handleScan = (decodedText) => {
    if (isProcessing) return; // Prevent spamming
    setIsProcessing(true);
    
    // Clear previous results immediately for better UX
    setLastScan(null);
    setTeamDetails(null);

    console.log("Scanned:", decodedText); // Debug

    socket.emit("VERIFY_SCAN", {
      ticketCode: decodedText,
      scannerId: scannerId
    });
  };
  
  const handleLogMember = (member) => {
    socket.emit("LOG_MEMBER_ENTRY", {
        teamId: teamDetails.teamId,
        memberId: member.id,
        memberName: member.name,
        scannerId: scannerId // Ensure backend knows which gate
    });
  };

  const handleInitialize = (gateType) => {
    // User interaction required to enable audio context
    successAudio.play().then(() => {
      successAudio.pause();
      successAudio.currentTime = 0;
      setScannerId(gateType);
      setIsUnlocked(true);
      toast.info(`System Armed: ${gateType.replace('_', ' ')}`);
    }).catch(() => {
        // Fallback if audio fails (still unlock)
        setScannerId(gateType);
        setIsUnlocked(true);
    });
  };

  const handleReset = () => {
    setLastScan(null);
    setTeamDetails(null);
    setIsProcessing(false);
    toast.info("Scanner Ready");
  };

  // --- RENDER: LOCKED STATE ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6 space-y-8">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-pink-500 leading-none">
            PANACHE<span className="text-white">SCAN</span>
          </h1>
        <div className="w-full max-w-sm space-y-4">
            <button onClick={() => handleInitialize('MAIN_GATE')} className="w-full flex items-center justify-center gap-4 py-6 bg-blue-600 hover:bg-blue-500 transition-colors rounded-[2rem] text-white font-black uppercase italic tracking-tighter text-xl shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                <Users size={24} /> Main Gate
            </button>
            <button onClick={() => handleInitialize('CELEBRITY_GATE')} className="w-full flex items-center justify-center gap-4 py-6 bg-pink-600 hover:bg-pink-500 transition-colors rounded-[2rem] text-white font-black uppercase italic tracking-tighter text-xl shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                <ShieldCheck size={24} /> Celebrity Gate
            </button>
        </div>
      </div>
    );
  }

  // --- RENDER: SCANNER STATE ---
  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-md mx-auto space-y-4 p-4 pt-24 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-pink-500 leading-none">
            PANACHE<span className="text-white">SCAN</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{scannerId?.replace('_', ' ')}</p>
        </div>
        <button onClick={handleReset} className="p-3 bg-white/5 rounded-2xl text-pink-500 border border-white/10 active:scale-95 transition-all hover:bg-white/10">
          <RefreshCw size={20} className={isProcessing && !teamDetails && !lastScan ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Camera Viewport */}
      <div className="relative group bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
        <div id="reader" className={`w-full h-full transition-all duration-300 ${isProcessing && !teamDetails ? 'opacity-50 grayscale' : 'opacity-100'}`} />
        
        {/* Processing Overlay */}
        {isProcessing && !teamDetails && !lastScan && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="bg-pink-600 px-6 py-2 rounded-full font-bold text-sm animate-pulse shadow-lg shadow-pink-600/40">
              VERIFYING...
            </div>
          </div>
        )}
      </div>

      {/* Result: Team Selection */}
      {teamDetails && (
        <div className="p-6 rounded-[2.5rem] border-2 bg-blue-900/20 border-blue-500/30 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-full">
                <Users className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none text-white">{teamDetails.teamName}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mt-1">Tap member to verify entry</p>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-white/10 max-h-60 overflow-y-auto">
            {teamDetails.members.map(member => (
              <button 
                key={member.id} 
                onClick={() => handleLogMember(member)} 
                className="w-full flex justify-between items-center text-left text-sm font-bold bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-blue-500/20 active:scale-[0.98] transition-all"
              >
                <span className="truncate">{member.name}</span>
                <UserCheck size={16} className="text-blue-400 flex-shrink-0" />
              </button>
            ))}
          </div>
          <button onClick={handleReset} className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
            Done / Next Scan
          </button>
        </div>
      )}

      {/* Result: Single User Scan */}
      {lastScan && (
        <div className={`p-6 rounded-[2.5rem] border-2 animate-in slide-in-from-bottom-4 duration-300 ${lastScan.isError ? 'bg-red-900/20 border-red-500/50' : 'bg-green-900/20 border-green-500/50'}`}>
          {lastScan.isError ? (
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <XCircle className="text-red-500" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-red-500 italic leading-none">Access Denied</h3>
                <p className="text-xs text-red-300 font-bold mt-1">{lastScan.error || "Invalid Ticket"}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${lastScan.action === 'ENTRY' ? 'bg-green-500 text-black shadow-green-500/20' : 'bg-blue-500 text-white shadow-blue-500/20'}`}>
                  {lastScan.action === 'ENTRY' ? <LogIn size={24} /> : <LogOut size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none text-white">{lastScan.teamName || "Guest"}</h3>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${lastScan.action === 'ENTRY' ? 'text-green-400' : 'text-blue-400'}`}>
                    {lastScan.message || `${lastScan.action} Recorded`}
                  </p>
                </div>
              </div>
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScannerPage;