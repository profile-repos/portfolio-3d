import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface CinematicLoaderProps {
  isLoading: boolean;
  message?: string;
  type?: "startup" | "api";
}

export const CinematicLoader = ({ 
  isLoading, 
  message = "Loading...",
  type = "startup" 
}: CinematicLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading && progress < 100) {
      const timeout = setTimeout(() => {
        setProgress(100);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, progress]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center overflow-hidden"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-slate-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                }}
                animate={{
                  y: [null, Math.random() * window.innerHeight],
                  x: [null, Math.random() * window.innerWidth],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center px-4">
            {/* Logo/Icon animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  className="w-24 h-24 mx-auto border-4 border-slate-400 rounded-full shadow-lg shadow-slate-500/50"
                  style={{
                    background: "linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(100, 116, 139, 0.1) 100%)",
                  }}
                  animate={{
                    rotate: 360,
                    borderColor: [
                      "rgb(148, 163, 184)",
                      "rgb(100, 116, 139)",
                      "rgb(148, 163, 184)",
                    ],
                  }}
                  transition={{
                    rotate: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    borderColor: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <motion.div
                    className="absolute inset-2 border-4 border-transparent border-t-slate-300 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div 
                    className="w-8 h-8 bg-gradient-to-br from-slate-400 via-gray-500 to-slate-600 rounded-lg shadow-lg shadow-slate-500/50"
                    style={{
                      boxShadow: "inset 0 2px 4px rgba(255, 255, 255, 0.1), 0 4px 8px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Text animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-300 via-gray-400 to-slate-500 bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {type === "startup" ? "Fine-tuning first impressions…" : message}
              </h2>
              <motion.p
                className="text-gray-300 text-lg md:text-xl"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {type === "startup" ? `Loading stories behind the work…${dots}` : `${message}${dots}`}
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 max-w-md mx-auto"
            >
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-slate-400 via-gray-500 to-slate-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                />
              </div>
              <motion.p
                className="text-gray-400 text-sm mt-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {Math.round(progress)}%
              </motion.p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-slate-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Scan line effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(148, 163, 184, 0.15) 50%, transparent 100%)",
            }}
            animate={{
              y: ["-100%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

