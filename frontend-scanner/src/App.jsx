import React, { useState, useEffect } from 'react';
import ScannerPage from './pages/ScannerPage';
import { io } from 'socket.io-client';


const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;


const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  upgrade: false, // Skip the "polling" phase entirely
  reconnection: true,
  reconnectionDelay: 500
});

function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    // socket.on('connect_error', () => toast.error("Gate Terminal Offline"));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);
  {/* Offline Alert Banner */ }
  {
    !isConnected && (
      <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-[10px] py-1 text-center font-black uppercase tracking-[0.2em] z-[110] animate-pulse">
        Connection Lost - Reconnecting...
      </div>
    )
  }



  return (
    <div className="App">
      <ScannerPage socket={socket} />
    </div>
  );
}

export default App;