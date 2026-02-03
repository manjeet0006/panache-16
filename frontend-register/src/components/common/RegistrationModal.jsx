import { motion, AnimatePresence } from "framer-motion";
import { X, School, Globe, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModernButton from "../common/ModernButton";

const RegistrationModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  // Smooth Spring Animation Variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 350, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Dark Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-15px_rgba(236,72,153,0.3)]"
          >
            {/* Premium Gradient Top Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
            >
              <X size={22} />
            </button>

            <div className="p-8 md:p-12 text-center">
              
              {/* Header Icon */}
              <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/10 flex items-center justify-center border border-white/5 shadow-inner">
                <Lock className="text-pink-500 w-7 h-7 drop-shadow-lg" />
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white mb-3">
                Identify Yourself
              </h2>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                Select your category to access the registration portal.
              </p>

              {/* Action Buttons */}
              <div className="space-y-4">
                <ModernButton 
                  onClick={() => navigate('/events?isVgu=true')} 
                  variant="primary"
                >
                  <School size={20} /> <span className="px-11" >VGU Student</span>  
                </ModernButton>
                
                <ModernButton 
                  onClick={() => navigate('/events?isVgu=false')} 
                  variant="secondary"
                >
                  <Globe size={20} /> External Participant
                </ModernButton>
              </div>

              {/* Footer Terms */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-[12px] text-gray-600 uppercase tracking-widest font-bold">
                  By joining, you agree to our <br/>
                  <button 
                    onClick={() => navigate('/terms-and-conditions')} 
                    className="text-pink-600 hover:text-pink-400 hover:underline mt-1 transition-colors"
                  >
                    Terms & Protocols
                  </button>
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;