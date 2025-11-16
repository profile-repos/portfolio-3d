import { CinematicLoader } from "./CinematicLoader";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
  error: Error | null;
}

export const LoadingScreen = ({ isLoading, error }: LoadingScreenProps) => {
  if (isLoading) {
    return <CinematicLoader isLoading={true} message="Bringing ideas to the screen…" type="startup" />;
  }

  if (error) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center z-[9999]"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 border-4 border-red-500 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <span className="text-red-500 text-2xl">✕</span>
            </motion.div>
            <p 
              className="text-red-400 text-xl font-light mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Failed to load portfolio
            </p>
            <p 
              className="text-gray-400 text-sm"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {error.message || 'No profile data available'}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
};

