import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  LogIn, LogOut, History as HistoryIcon, 
  CheckCircle2, XCircle, RefreshCw 
} from 'lucide-react';
import { toast } from 'sonner';
import API from '../api'; 

// --- Pre-load Audio Assets for Instant Playback ---
const successAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
const errorAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/954/954-preview.mp3');
successAudio.volume = 0.5;
errorAudio.volume = 0.6;

const ScannerPage = ({ socket }) => {
  const [lastScan, setLastScan] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false); // Safety lock for audio/haptics

  const isLocked = useRef(false);
  const scannerRef = useRef(null);

  /**
   * FULL SENSORY FEEDBACK ALGORITHM
   * Combines Visual, Audio, and Haptic feedback
   */
  const playFeedback = (type) => {
    // 1. Audio Logic
    const sound = type === 'success' ? successAudio : errorAudio;
    sound.currentTime = 0;
    sound.play().catch(() => {});

    // 2. Haptic (Vibration) Logic
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (type === 'success') {
        navigator.vibrate(70); // Sharp short tap
      } else {
        navigator.vibrate([150, 50, 150]); // Aggressive double buzz
      }
    }
  };

  useEffect(() => {
    if (!isUnlocked) return; // Wait for user interaction

    // WebSocket Listeners
    socket.on("SCAN_SUCCESS", (data) => {
      setLastScan(data);
      playFeedback('success');

      if (data.teamId) {
        API.get(`/scan/team-history/${data.teamId}`)
          .then(h => setRecentLogs(h.data))
          .catch(() => {});
      }

      toast.success(`${data.action}: ${data.teamName}`);

      setTimeout(() => {
        isLocked.current = false;
        setIsProcessing(false);
      }, 1500); // 1.5s Cooldown for fast entry lines
    });

    socket.on("SCAN_ERROR", (data) => {
      playFeedback('error');
      toast.error(data.error);
      setLastScan({ error: data.error, isError: true });

      setTimeout(() => {
        isLocked.current = false;
        setIsProcessing(false);
      }, 1000); // Shorter cooldown for errors to allow retry
    });

    // Scanner Initialization
    const qrcodeScanner = new Html5QrcodeScanner("reader", {
      fps: 30, // Max FPS for fast detection
      qrbox: { width: 280, height: 280 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
    });

    qrcodeScanner.render((text) => handleScan(text), (err) => {});
    scannerRef.current = qrcodeScanner;

    return () => {
      socket.off("SCAN_SUCCESS");
      socket.off("SCAN_ERROR");
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.warn(e));
      }
    };
  }, [socket, isUnlocked]);

  const handleScan = (decodedText) => {
    if (isLocked.current) return;
    isLocked.current = true;
    setIsProcessing(true);

    socket.emit("VERIFY_SCAN", {
      ticketCode: decodedText,
      scannerId: "INSTANT_GATE_01"
    });
  };

  const handleInitialize = () => {
    // Required to unlock browser audio/haptic capabilities
    successAudio.play().then(() => {
      successAudio.pause();
      setIsUnlocked(true);
      toast.info("System Armed & Ready");
    });
  };

  const handleReset = () => {
    setLastScan(null);
    setRecentLogs([]);
    isLocked.current = false;
    setIsProcessing(false);
  };

  // --- Initial System Setup View ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
        <button 
          onClick={handleInitialize}
          className="w-full max-w-xs py-8 bg-pink-500 rounded-[2.5rem] text-black font-black uppercase italic tracking-tighter text-2xl shadow-[0_0_40px_rgba(236,72,153,0.3)]"
        >
          Initialize Gate
        </button>
      </div>
    );
  }

  // --- Main Scanner View ---
  return (
    <div className="max-w-md mx-auto space-y-4 p-4 pt-5 ">
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-pink-500 leading-none">
            PANACHE<span className="text-white">SCAN</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Haptic Terminal v2.1</p>
        </div>
        <button onClick={handleReset} className="p-3 bg-white/5 rounded-2xl text-pink-500 border border-white/10 active:scale-95 transition-all">
          <RefreshCw size={20} className={isProcessing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative group">
        <div id="reader" className={`overflow-hidden rounded-[2.5rem] border-2 transition-all duration-500 ${isProcessing ? 'border-pink-500 opacity-30 grayscale' : 'border-white/10'}`} />
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-pink-600 px-8 py-3 rounded-2xl font-black text-sm animate-bounce uppercase shadow-2xl shadow-pink-500/50">
              Verifying...
            </div>
          </div>
        )}
      </div>

      {lastScan && (
        <div className={`p-6 rounded-[2.5rem] border-2 animate-in slide-in-from-bottom-4 duration-500 ${lastScan.isError ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
          {lastScan.isError ? (
            <div className="flex items-center gap-4">
              <XCircle className="text-red-500" size={40} />
              <div>
                <h3 className="text-sm font-black uppercase text-red-500 italic">Access Denied</h3>
                <p className="text-xs text-red-200/60 font-bold">{lastScan.error}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${lastScan.action === 'ENTRY' ? 'bg-green-500 text-black' : 'bg-blue-500 text-black'}`}>
                    {lastScan.action === 'ENTRY' ? <LogIn /> : <LogOut />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">{lastScan.teamName}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{lastScan.action} Recorded</p>
                  </div>
                </div>
                <CheckCircle2 className="text-green-500" size={32} />
              </div>

              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2 text-gray-500 px-1">
                    <HistoryIcon size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Recent Activity</span>
                </div>
                {recentLogs.slice(0, 2).map((log, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-bold bg-black/40 p-3 rounded-xl border border-white/5">
                    <span className={log.type === 'ENTRY' ? 'text-green-400' : 'text-blue-400'}>{log.type} SUCCESS</span>
                    <span className="text-gray-600">{new Date(log.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ScannerPage;