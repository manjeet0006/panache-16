import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  LogIn, LogOut, History as HistoryIcon, UserCheck,
  CheckCircle2, XCircle, RefreshCw, Users, Lock, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

const successAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
const errorAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/954/954-preview.mp3');
successAudio.volume = 0.5;
errorAudio.volume = 0.6;

const ScannerPage = ({ socket }) => {
  const [scannerId, setScannerId] = useState(null);
  const [lastScan, setLastScan] = useState(null);
  const [teamDetails, setTeamDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const isLocked = useRef(false);
  const scannerRef = useRef(null);

  const playFeedback = (type) => {
    const sound = type === 'success' ? successAudio : errorAudio;
    sound.currentTime = 0;
    sound.play().catch(() => {});
    if (navigator.vibrate) {
      navigator.vibrate(type === 'success' ? 70 : [150, 50, 150]);
    }
  };

  useEffect(() => {
    if (!isUnlocked || !socket) return;

    const handleScanSuccess = (data) => {
      setLastScan(data);
      playFeedback('success');
      toast.success(`${data.action}: ${data.teamName}`);
      setTimeout(() => {
        isLocked.current = false;
        setIsProcessing(false);
      }, 1500);
    };

    const handleScanError = (data) => {
      setLastScan({ error: data.error, isError: true });
      playFeedback('error');
      toast.error(data.error);
      setTimeout(() => {
        isLocked.current = false;
        setIsProcessing(false);
      }, 1000);
    };
    
    const handleTeamDetails = (data) => {
      setTeamDetails(data);
      playFeedback('success');
      toast.info(`Team Found: ${data.teamName}`);
      setIsProcessing(false);
    };

    const handleMemberLogSuccess = ({ message }) => {
      toast.success(message);
    };

    socket.on("SCAN_SUCCESS", handleScanSuccess);
    socket.on("SCAN_ERROR", handleScanError);
    socket.on("SCAN_TEAM_DETAILS", handleTeamDetails);
    socket.on("MEMBER_LOG_SUCCESS", handleMemberLogSuccess);

    const qrcodeScanner = new Html5QrcodeScanner("reader", {
      fps: 30,
      qrbox: { width: 280, height: 280 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
    });
    qrcodeScanner.render((text) => handleScan(text), (err) => {});
    scannerRef.current = qrcodeScanner;

    return () => {
      socket.off("SCAN_SUCCESS", handleScanSuccess);
      socket.off("SCAN_ERROR", handleScanError);
      socket.off("SCAN_TEAM_DETAILS", handleTeamDetails);
      socket.off("MEMBER_LOG_SUCCESS", handleMemberLogSuccess);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.warn(e));
      }
    };
  }, [socket, isUnlocked]);

  const handleScan = (decodedText) => {
    if (isLocked.current) return;
    isLocked.current = true;
    setIsProcessing(true);
    setLastScan(null);
    setTeamDetails(null);

    socket.emit("VERIFY_SCAN", {
      ticketCode: decodedText,
      scannerId: scannerId
    });
  };
  
  const handleLogMember = (member) => {
    socket.emit("LOG_MEMBER_ENTRY", {
        teamId: teamDetails.teamId,
        memberId: member.id,
        memberName: member.name
    });
  };

  const handleInitialize = (gateType) => {
    setScannerId(gateType);
    successAudio.play().then(() => {
      successAudio.pause();
      setIsUnlocked(true);
      toast.info(`System Armed: ${gateType.replace('_', ' ')}`);
    });
  };

  const handleReset = () => {
    setLastScan(null);
    setTeamDetails(null);
    isLocked.current = false;
    setIsProcessing(false);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6 space-y-8">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-pink-500 leading-none">
            PANACHE<span className="text-white">SCAN</span>
          </h1>
        <div className="w-full max-w-sm space-y-4">
            <button onClick={() => handleInitialize('MAIN_GATE')} className="w-full flex items-center justify-center gap-4 py-6 bg-blue-500 rounded-[2rem] text-black font-black uppercase italic tracking-tighter text-xl shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                <Users /> Main Gate
            </button>
            <button onClick={() => handleInitialize('CELEBRITY_GATE')} className="w-full flex items-center justify-center gap-4 py-6 bg-pink-500 rounded-[2rem] text-black font-black uppercase italic tracking-tighter text-xl shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                <ShieldCheck /> Celebrity Gate
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto space-y-4 p-4 pt-24">
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-pink-500 leading-none">
            PANACHE<span className="text-white">SCAN</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{scannerId.replace('_', ' ')}</p>
        </div>
        <button onClick={handleReset} className="p-3 bg-white/5 rounded-2xl text-pink-500 border border-white/10 active:scale-95 transition-all">
          <RefreshCw size={20} className={isProcessing && !teamDetails ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative group">
        <div id="reader" className={`overflow-hidden rounded-[2.5rem] border-2 transition-all duration-500 ${isProcessing && !teamDetails ? 'border-pink-500 opacity-30 grayscale' : 'border-white/10'}`} />
        {isProcessing && !teamDetails && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-pink-600 px-8 py-3 rounded-2xl font-black text-sm animate-bounce uppercase shadow-2xl shadow-pink-500/50">
              Verifying...
            </div>
          </div>
        )}
      </div>

      {teamDetails && (
        <div className="p-6 rounded-[2.5rem] border-2 bg-blue-500/10 border-blue-500/30 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-4">
            <Users className="text-blue-400" size={40} />
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">{teamDetails.teamName}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Select member to log entry</p>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-white/10">
            {teamDetails.members.map(member => (
              <button key={member.id} onClick={() => handleLogMember(member)} className="w-full flex justify-between items-center text-left text-sm font-bold bg-black/40 p-4 rounded-xl border border-white/10 hover:bg-blue-500/20 active:scale-[0.98] transition-all">
                <span>{member.name}</span>
                <UserCheck size={18} className="text-blue-400" />
              </button>
            ))}
          </div>
        </div>
      )}

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${lastScan.action === 'ENTRY' ? 'bg-green-500 text-black' : 'bg-blue-500 text-black'}`}>
                  {lastScan.action === 'ENTRY' ? <LogIn /> : <LogOut />}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">{lastScan.teamName}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{lastScan.message || `${lastScan.action} Recorded`}</p>
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
