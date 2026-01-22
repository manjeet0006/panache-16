import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  LogIn, LogOut, ShieldAlert, History as HistoryIcon, 
  Zap, CheckCircle2, XCircle, RefreshCw, WifiOff 
} from 'lucide-react';
import { toast } from 'sonner';
import API from '../api'; 

const SUCCESS_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
const ERROR_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3';

const ScannerPage = ({ socket }) => {
  const [lastScan, setLastScan] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isLocked = useRef(false); 
  const scannerRef = useRef(null);

  const playFeedback = (type) => {
    const audio = new Audio(type === 'success' ? SUCCESS_SOUND : ERROR_SOUND);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    // WebSocket Event Listeners
    socket.on("SCAN_SUCCESS", (data) => {
      setLastScan(data);
      playFeedback('success');
      
      // Background history fetch (Non-blocking)
      if (data.teamId) {
        API.get(`/scan/team-history/${data.teamId}`)
          .then(h => setRecentLogs(h.data))
          .catch(() => {});
      }

      toast.success(`${data.action}: ${data.teamName}`);
      
      // Cooldown before next scan
      setTimeout(() => {
        isLocked.current = false;
        setIsProcessing(false);
      }, 2000);
    });

    socket.on("SCAN_ERROR", (data) => {
      playFeedback('error');
      toast.error(data.error);
      setLastScan({ error: data.error, isError: true });
      
      setTimeout(() => {
        isLocked.current = false;
        setIsProcessing(false);
      }, 2000);
    });

    // Scanner Initialization
    const qrcodeScanner = new Html5QrcodeScanner("reader", { 
      fps: 24, 
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
  }, [socket]);

  const handleScan = (decodedText) => {
    if (isLocked.current) return;
    
    isLocked.current = true;
    setIsProcessing(true);
    
    // Emit through WebSocket pipe
    socket.emit("VERIFY_SCAN", { 
      ticketCode: decodedText,
      scannerId: "INSTANT_GATE_01" 
    });
  };

  const handleReset = () => {
    setLastScan(null);
    setRecentLogs([]);
    isLocked.current = false;
    setIsProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      {/* Visual Header */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-pink-500">
            PANACHE<span className="text-white">SCAN</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Real-time Terminal</p>
        </div>
        <button onClick={handleReset} className="p-3 bg-white/5 rounded-2xl text-pink-500 border border-white/10">
          <RefreshCw size={20} className={isProcessing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Scanner Element */}
      <div className="relative">
          <div id="reader" className={`overflow-hidden rounded-[2.5rem] border-2 transition-all duration-500 ${
              isProcessing ? 'border-pink-500 opacity-30 grayscale' : 'border-white/10'
          }`} />
          {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-pink-600 px-6 py-2 rounded-full font-black text-xs animate-bounce uppercase">
                      Verifying...
                  </div>
              </div>
          )}
      </div>

      {/* Interaction Card */}
      {lastScan && (
        <div className={`p-6 rounded-[2.5rem] border-2 animate-in slide-in-from-bottom-4 ${
          lastScan.isError ? 'bg-red-500/10 border-red-500/30' : 
          lastScan.action === 'ENTRY' ? 'bg-green-500/10 border-green-500/30' : 'bg-blue-500/10 border-blue-500/30'
        }`}>
          {lastScan.isError ? (
            <div className="flex items-center gap-4">
               <XCircle className="text-red-500" size={40} />
               <div>
                 <h3 className="text-sm font-black uppercase text-red-500">Invalid</h3>
                 <p className="text-xs text-red-200/60 font-bold">{lastScan.error}</p>
               </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    lastScan.action === 'ENTRY' ? 'bg-green-500 text-black' : 'bg-blue-500 text-black'
                  }`}>
                    {lastScan.action === 'ENTRY' ? <LogIn /> : <LogOut />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">{lastScan.teamName}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{lastScan.action} Recorded</p>
                  </div>
                </div>
                <CheckCircle2 className={lastScan.action === 'ENTRY' ? 'text-green-500' : 'text-blue-500'} size={32} />
              </div>

              {/* Mini History */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                {recentLogs.slice(0, 3).map((log, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-bold bg-black/40 p-2 rounded-xl">
                    <span className={log.type === 'ENTRY' ? 'text-green-400' : 'text-blue-400'}>{log.type}</span>
                    <span className="text-gray-600">{new Date(log.scannedAt).toLocaleTimeString()}</span>
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