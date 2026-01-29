import { motion } from "framer-motion";

const PleasantCard = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`relative p-8 rounded-3xl bg-neutral-900 border border-neutral-800 group transition-colors duration-300 hover:border-neutral-700 ${className}`}
    >
      {/* Soft background glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative h-full z-10">{children}</div>
    </motion.div>
  );
};

export default PleasantCard;
