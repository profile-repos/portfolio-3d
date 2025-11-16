import { useState } from 'react';
import { Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Modal } from './Modal';
import { categoryIcons } from '@/types';
import { parseSkillsList } from '@/utils/helpers';
import type { ProfileData } from '@/services/api';

interface SkillsProps {
  profile: ProfileData;
  mousePosition: { x: number; y: number };
}

export const Skills = ({ profile, mousePosition }: SkillsProps) => {
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section id="skills" className="relative py-20 px-4" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-gray-400"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}
          initial={{ opacity: 0, y: 30 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Skills & Expertise
        </motion.h2>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={sectionVisible ? "visible" : "hidden"}
        >
          {profile.skills.map((skill) => {
            const Icon = categoryIcons[skill.category.name] || Code;
            const skillItems = parseSkillsList(skill.skills_list);
            return (
              <motion.div 
                key={skill.id}
                className="group relative p-8 rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-slate-400/50 transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
                  borderRadius: '1rem',
                }}
                variants={itemVariants}
                onClick={() => setSelectedSkill(skill.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-gray-500/0 group-hover:from-slate-500/20 group-hover:to-gray-500/20 transition-all duration-500" style={{ borderRadius: '1rem' }}></div>
                
                <Icon className="w-12 h-12 mb-4 text-slate-300 group-hover:scale-110 transition-transform" />
                <h3 
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.02em' }}
                >
                  {skill.category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillItems.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-500/20 rounded-full text-sm border border-slate-400/30">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Skill Modal */}
      {selectedSkill && (() => {
        const skill = profile.skills.find(s => s.id === selectedSkill);
        if (!skill) return null;
        const skillItems = parseSkillsList(skill.skills_list);
        const Icon = categoryIcons[skill.category.name] || Code;
        
        return (
          <Modal
            isOpen={!!selectedSkill}
            onClose={() => setSelectedSkill(null)}
            title={skill.category.name}
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-500 to-gray-500 rounded-xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p 
                    className="text-gray-300 text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {skill.category.description || 'Expertise in this category'}
                  </p>
                </div>
              </div>

              <div>
                <h3 
                  className="text-xl font-bold mb-4 text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillItems.map((item, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-500/20 rounded-full text-sm border border-slate-400/30">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        );
      })()}
    </section>
  );
};

