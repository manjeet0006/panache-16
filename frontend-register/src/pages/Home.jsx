import React, { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

import NoiseOverlay from "../components/common/NoiseOverlay";
import RegistrationModal from "../components/common/RegistrationModal";
import Hero from "../components/home/Hero";
import Statistics from "../components/home/Statistics";

import Sponsors from "../components/home/Sponsors";
import Faq from "../components/home/Faq";
import Footer from "../components/home/Footer";
import Performers from "@/components/home/Performers";
import About from "@/components/home/About";
import Developers from "@/components/home/Developers";
// import { Domains } from "@/components/home/Domains";

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const scrollRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // --- PHYSICS SCROLL ENGINE ---
  const { scrollY, scrollYProgress } = useScroll();
  const smoothY = useSpring(scrollY, {
    damping: 20,
    stiffness: 100,
    mass: 0.5,
  });
  const y = useTransform(smoothY, (value) => -value);
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // FAST BACKGROUND ANIMATION: Changed range to -100% for speed
  const bgTextX = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const subTextX = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -150]);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) setContentHeight(entry.contentRect.height);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="relative bg-[#030303] text-white selection:bg-pink-500/30 font-sans min-h-screen overflow-hidden">
      <NoiseOverlay />

      <RegistrationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onRegister={() => navigate("/register")}
      />

      {/* Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 origin-left z-50 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
      />

      {/* Fixed Parallax Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          style={{ y: yParallax }}
          className="relative w-full h-[120vh]"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-900/10 rounded-full blur-[120px]" />
        </motion.div>

        {/* FAST MOVING BACKGROUND TEXT */}
        <motion.div
          style={{ x: bgTextX }}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-full"
        >
          <div className="text-[20vw] font-black text-white/[0.03] whitespace-nowrap uppercase italic tracking-tighter leading-none">
            Panache S16
          </div>
        </motion.div>

        <motion.div
          style={{ x: subTextX }}
          className="absolute top-[65%] left-0 w-full"
        >
          <div className="flex gap-12 text-sm md:text-xl font-bold text-white/10 whitespace-nowrap uppercase tracking-[1em]">
            <span>Create • Inspire • Celebrate</span>
            <span>•</span>
            <span>VGU Jaipur</span>
            <span>•</span>
            <span>Cultural Fest 2026</span>
            <span>•</span>
            <span>Create • Inspire • Celebrate</span>
          </div>
        </motion.div>
      </div>

      {/* --- SCROLLABLE CONTENT WRAPPER --- */}
      <div style={{ height: contentHeight }} className="relative w-full">
        <motion.div
          ref={scrollRef}
          style={{ y }}
          className="fixed top-0 left-0 w-full z-10 overflow-hidden will-change-transform"
        >
          <Hero setShowModal={setShowModal}/>
          {/* <Statistics />
          <Performers/>
          <Sponsors />
          <About/>
          <Faq />
          <Footer setShowModal={setShowModal}/> */}
          <Performers/>
          <Sponsors />
          <Developers/>
          <About/>
          <Faq />
          <Statistics />

          <Footer setShowModal={setShowModal}/>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;