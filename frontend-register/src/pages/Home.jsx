import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex flex-col justify-center">
      
      {/* 1. Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

      {/* 2. Hero Content */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <span className="text-pink-400 text-xs font-bold uppercase tracking-[0.3em]">The Biggest Cultural Fest</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase">
          Unleash the <br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Panache Era
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-lg md:text-xl text-gray-400 font-medium">
          Step into a world of vibrant culture, fierce competition, and 
          unforgettable memories. Your stage is waiting.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="group relative rounded-full bg-white px-10 py-5 text-black font-black uppercase tracking-tighter hover:bg-pink-500 hover:text-white transition-all duration-300"
          >
            Start Registration
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500"></span>
            </span>
          </button>
          
          <button className="px-10 py-5 rounded-full border border-white/20 font-bold hover:bg-white/5 transition">
            View Schedule
          </button>
        </div>
      </section>

      {/* 3. Improved Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          
          <div className="relative w-full max-w-lg rounded-[2rem] bg-[#111] border border-white/10 p-10 shadow-2xl overflow-hidden">
            {/* Modal Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/20 blur-[60px]"></div>

            <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter italic">
              Identify <span className="text-pink-500">Yourself</span>
            </h2>
            <p className="text-gray-400 mb-8 font-medium">
              Choose your category to see events you can participate in.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/events?isVgu=true')}
                className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-white/[0.08] transition-all"
              >
                <div className="text-left">
                  <p className="text-xl font-bold">VGU Student</p>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Internal Access</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all">
                  →
                </div>
              </button>

              <button
                onClick={() => navigate('/events?isVgu=false')}
                className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.08] transition-all"
              >
                <div className="text-left">
                  <p className="text-xl font-bold">Outside Student</p>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Open Registration</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                  →
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-8 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-white transition"
            >
              [ Close Window ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;