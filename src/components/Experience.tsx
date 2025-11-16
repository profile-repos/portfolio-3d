import { useState } from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Modal } from './Modal';
import { formatDate } from '@/utils/helpers';
import type { ProfileData } from '@/services/api';

interface ExperienceProps {
  profile: ProfileData;
}

export const Experience = ({ profile }: ExperienceProps) => {
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({ triggerOnce: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section className="relative py-20 px-4" ref={sectionRef}>
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-gray-400"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}
          initial={{ opacity: 0, y: 30 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Work Experience
        </motion.h2>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={sectionVisible ? "visible" : "hidden"}
        >
          {profile.work_experience.map((exp) => (
            <motion.div 
              key={exp.id}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 p-8 hover:border-slate-400/50 transition-all mb-6 cursor-pointer"
              style={{ borderRadius: '1rem' }}
              variants={itemVariants}
              onClick={() => setSelectedExperience(exp.id)}
            >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-gray-500/0 hover:from-slate-500/10 hover:to-gray-500/10 transition-all" style={{ borderRadius: '1rem' }}></div>
            
            <div className="relative">
              <div className="flex items-start gap-4 mb-4">
                <Briefcase className="w-8 h-8 text-slate-300 flex-shrink-0" />
                <div className="flex-1">
                  <h3 
                    className="text-2xl font-bold capitalize"
                    style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.01em' }}
                  >
                    {exp.position}
                  </h3>
                  <p 
                    className="text-slate-300 mb-2 capitalize"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {exp.company}
                  </p>
                  <p 
                    className="text-gray-400 text-sm mb-4"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : (exp.end_date ? formatDate(exp.end_date) : 'Present')}
                  </p>
                  
                  <p 
                    className="text-gray-300 leading-relaxed mb-4"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {exp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies_used.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-500/20 rounded-full text-sm border border-slate-400/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Experience Modal */}
      {selectedExperience && (() => {
        const exp = profile.work_experience.find(e => e.id === selectedExperience);
        if (!exp) return null;
        
        return (
          <Modal
            isOpen={!!selectedExperience}
            onClose={() => setSelectedExperience(null)}
            title={`${exp.position} at ${exp.company}`}
          >
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p 
                    className="text-slate-300 text-lg mb-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {exp.company}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : (exp.end_date ? formatDate(exp.end_date) : 'Present')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 
                  className="text-lg font-bold mb-3 text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Description
                </h3>
                <p 
                  className="text-gray-300 leading-relaxed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {exp.description}
                </p>
              </div>

              {exp.technologies_used.length > 0 && (
                <div>
                  <h3 
                    className="text-lg font-bold mb-3 text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies_used.map((tech, i) => (
                      <span key={i} className="px-4 py-2 bg-slate-500/20 rounded-full text-sm border border-slate-400/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        );
      })()}
    </section>
  );
};

