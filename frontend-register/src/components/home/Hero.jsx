import { useRef } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  animate,
} from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import PanacheHybridLogo from "../logo/PanacheHybridLogo";
import ActiveScrollReveal from "../common/ActiveScrollReveal";
import ModernButton from "../common/ModernButton";

const Hero = ({ setShowModal }) => {
  const heroRef = useRef(null);
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);

  const smoothMX = useSpring(mX, { stiffness: 300, damping: 20, mass: 0.5 });
  const smoothMY = useSpring(mY, { stiffness: 100, damping: 55, mass: 0.5 });

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mX.set(e.clientX - centerX);
    mY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    animate(mX, 0, { type: "spring", stiffness: 400, damping: 40 });
    animate(mY, 0, { type: "spring", stiffness: 400, damping: 40 });
  };
  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-10 md:px-6 md:pt-20"
    >
      <ActiveScrollReveal direction="down">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4 md:mb-8">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Edition 16
            </span>
          </div>
        </div>
      </ActiveScrollReveal>

      {/* LOGO: HYBRID DESIGN + 3D MOUSE TRACKING */}
      <div className="mb-2 md:mb-4 scale-90 md:scale-100 transition-transform duration-500 z-50">
        <PanacheHybridLogo mouseX={smoothMX} mouseY={smoothMY} />
      </div>

      <ActiveScrollReveal delay={0.2} direction="up">
        <div className="text-center mb-6 md:mb-16">
          <p className="text-gray-400 font-medium text-sm md:text-lg tracking-wide">
            The Annual Festival of Culture, Sports and Technology.
          </p>
        </div>
      </ActiveScrollReveal>

      <ActiveScrollReveal delay={0.4} direction="up">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md mx-auto z-20">
          <ModernButton
            onClick={() => setShowModal(true)}
            variant="primary"
          >
            Register Now <ArrowRight size={18} />
          </ModernButton>
          <ModernButton
            onClick={() =>
              document
                .getElementById("domains")
                .scrollIntoView({ behavior: "smooth" })
            }
            variant="secondary"
          >
            <Play size={18} /> Watch Teaser
          </ModernButton>
        </div>
      </ActiveScrollReveal>

      <motion.div
        animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;