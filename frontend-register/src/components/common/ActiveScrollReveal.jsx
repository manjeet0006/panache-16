import { motion } from "framer-motion";

// --- CORE FEATURE: In & Out Scroll Animation ---
const ActiveScrollReveal = ({
  children,
  delay = 0,
  width = "100%",
  direction = "up",
}) => {
  const directions = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
        scale: 0.9,
        filter: "blur(10px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        ...directions[direction],
        scale: 0.9,
        filter: "blur(10px)",
      }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
};

export default ActiveScrollReveal;
