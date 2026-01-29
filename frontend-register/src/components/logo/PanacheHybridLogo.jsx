import { useRef } from "react";
import { motion, useInView, useTransform } from "framer-motion";
import HybridLogoCard from "./HybridLogoCard";

import p from "../../assets/p.png";
import a1 from "../../assets/a1.png";
import n from "../../assets/n.png";
import a2 from "../../assets/a2.png";
import c from "../../assets/c.png";
import h from "../../assets/h.png";
import e from "../../assets/e.png";


const PanacheHybridLogo = ({ mouseX, mouseY }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const letters = [
    { l: p },
    { l: a1 },
    { l: n },
    { l: a2 },
    { l: c },
    { l: h },
    { l: e },
  ];

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-1 md:gap-3 py-4 md:py-20 perspective-800" // Lower perspective = deeper 3D effect
      style={{ perspective: "700px" }}
    >
      <motion.div
        className="flex md:gap-2"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ x: "-100vw" }}
        animate={{ x: isInView ? 0 : "-100vw" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {letters.map((item, i) => (
          <HybridLogoCard
            key={i}
            letter={item.l}
            delay={i * 0.05}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </motion.div>

      {/* The '16' Cube with High Rotation */}
      {/* <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
        whileHover={{ rotate: 90, scale: 1.1 }}
        style={{
          // Aggressive rotation for the cube
          rotateX: useTransform(mouseY, [-300, 300], [45, -45]),
          rotateY: useTransform(mouseX, [-300, 300], [-45, 45]),
          transformStyle: "preserve-3d",
        }}
        className="relative ml-2 w-10 h-10 md:w-20 md:h-20"
      >
        <div className="absolute inset-0 bg-white transform rotate-3 rounded-2xl shadow-2xl" />
        <div className="absolute inset-0 bg-[#0a0a0a] transform -rotate-3 rounded-2xl flex items-center justify-center border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 opacity-20" />
          <span className="text-2xl md:text-4xl font-black text-white italic tracking-tighter z-10">
            16
          </span>
        </div>
      </motion.div> */}
    </div>
  );
};

export default PanacheHybridLogo;