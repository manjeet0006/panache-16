import { motion, useTransform } from "framer-motion";

const HybridLogoCard = ({
  letter,
  delay,
  mouseX,
  mouseY,
}) => {
  // 3D Tilt calculation - INCREASED RANGE for visible effect
  // Input range [-300, 300] (pixels from center), Output range [45, -45] (degrees)
  const rotateX = useTransform(mouseY, [-300, 300], [45, -45]);
  const rotateY = useTransform(mouseX, [-300, 300], [-45, 45]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        // Floating animation
        translateY: [0, -15, 0],
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 10,
        delay: delay,
        translateY: {
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
          delay: delay,
        },
      }}
      whileHover={{ scale: 1.2, z: 60, rotate: Math.random() * 10 - 5 }}
      className="relative w-10 h-10 md:w-20 md:h-20 flex items-center justify-center"
    >
      <motion.img
        style={{ transform: "translateZ(40px)" }}
        src={letter}
        alt=""
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
};

export default HybridLogoCard;
