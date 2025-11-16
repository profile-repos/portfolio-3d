import { useState } from 'react';
import { ChevronDown, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLottieAnimation } from '@/hooks/use-lottie-animation';
import { getInitials } from '@/utils/helpers';
import { socialIcons } from '@/types';
import type { ProfileData } from '@/services/api';

interface HeroProps {
  profile: ProfileData;
  mousePosition: { x: number; y: number };
}

const Hero = ({ profile, mousePosition }: HeroProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const lottieContainerRef = useLottieAnimation(profile.user.profile_photo);
  
  // Filter active social links
  const activeSocialLinks = profile.social_links?.filter(link => link.is_active) || [];
  
  // Get current position from work experience
  const currentWork = profile.work_experience?.find(exp => exp.is_current) || profile.work_experience?.[0];

  const parallaxStyle = {
    transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 20}px, 0)`
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center px-4 cursor-pointer"
      onClick={() => setShowPopup(true)}
    >
      <div className="max-w-6xl mx-auto text-center z-10">
        <div 
          className="mb-8 relative inline-block"
          style={{
            transform: `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${-mousePosition.y * 10}deg)`
          }}
        >
          <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 mx-auto rounded-full bg-gradient-to-br from-slate-600 via-gray-500 to-slate-700 p-1 shadow-2xl shadow-slate-500/50 overflow-hidden transition-all duration-300" style={{ boxShadow: '0 0 40px rgba(148, 163, 184, 0.3)' }}>
            <div 
              ref={lottieContainerRef}
              className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden relative"
            >
              {!profile.user.profile_photo && (
                <div 
                  className="text-6xl md:text-7xl lg:text-8xl font-bold w-full h-full flex items-center justify-center relative"
                  style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    letterSpacing: '0.05em'
                  }}
                >
                  <span 
                    className="relative z-10 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 25px rgba(148, 163, 184, 0.8)) drop-shadow(0 0 40px rgba(148, 163, 184, 0.5))',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 25px rgba(148, 163, 184, 0.7)',
                      WebkitTextStroke: '1px rgba(148, 163, 184, 0.3)'
                    }}
                  >
                    {getInitials(profile.user.first_name, profile.user.last_name)}
                  </span>
                  {/* Glow effect behind text */}
                  <span 
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-300 via-gray-400 to-slate-500 bg-clip-text text-transparent opacity-30 blur-sm"
                    style={{
                      fontFamily: "'Playfair Display', serif", 
                      letterSpacing: '0.05em',
                      fontSize: 'inherit',
                      fontWeight: 'bold'
                    }}
                  >
                    {getInitials(profile.user.first_name, profile.user.last_name)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="absolute -inset-4 md:-inset-6 lg:-inset-8 xl:-inset-10 bg-gradient-to-r from-slate-500 to-gray-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
        </div>
        
        <h1 
          className="text-6xl md:text-8xl font-bold mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-slate-300 via-gray-300 to-slate-400"
          style={{ ...parallaxStyle, fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
        >
          {profile.user.first_name} {profile.user.last_name}
        </h1>
        
        <p 
          className="text-lg text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {profile.user.bio}
        </p>

        <div className="flex gap-4 justify-center mb-12 flex-wrap">
          {activeSocialLinks.map((link) => {
            const Icon = socialIcons[link.platform.toLowerCase()] || MessageCircle;
            return (
              <a 
                key={link.id}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-110 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon size={24} />
              </a>
            );
          })}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            const skillsSection = document.getElementById('skills');
            if (skillsSection) {
              skillsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="mx-auto animate-bounce hover:scale-110 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400/50 rounded-full p-2"
          aria-label="Scroll to Skills & Expertise"
        >
          <ChevronDown size={32} className="text-slate-300 hover:text-white transition-colors" />
        </button>
      </div>

      {/* Popup with Cards */}
      <AnimatePresence>
        {showPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowPopup(false)}
            />

            {/* Popup Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with Close Button */}
                <div className="flex items-center justify-end p-4 sticky top-0 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl z-10">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                    aria-label="Close popup"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Profile Content */}
                <div className="p-8 text-center">
                  {/* Name */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-300 via-gray-300 to-slate-400"
                    style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
                  >
                    {profile.user.first_name} {profile.user.last_name}
                  </motion.h2>

                  {/* Position */}
                  {currentWork && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl md:text-2xl text-gray-300 mb-6 font-light"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em' }}
                    >
                      {currentWork.position}
                    </motion.p>
                  )}

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {profile.user.bio}
                  </motion.p>

                  {/* Social Icons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-4 justify-center flex-wrap"
                  >
                    {activeSocialLinks.map((link) => {
                      const Icon = socialIcons[link.platform.toLowerCase()] || MessageCircle;
                      return (
                        <a 
                          key={link.id}
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-110 backdrop-blur-sm border border-white/10 hover:border-slate-400/50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon size={24} className="text-white" />
                        </a>
                      );
                    })}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export { Hero };
