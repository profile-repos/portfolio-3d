import { useState } from 'react';
import { Zap, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Modal } from './Modal';

export const LetsWorkTogether = () => {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({ triggerOnce: true });

  const features = [
    {
      id: 1,
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Quick turnaround times without compromising on quality or performance.',
      details: 'I understand the importance of timely delivery. My streamlined development process ensures that projects are completed efficiently while maintaining the highest standards of code quality and user experience.'
    },
    {
      id: 2,
      icon: Target,
      title: 'Scalable Solutions',
      description: 'Architecture designed to grow with your business needs and user base.',
      details: 'Every solution I build is designed with scalability in mind. From microservices architecture to cloud-native applications, I ensure your platform can handle growth without requiring complete rewrites.'
    },
    {
      id: 3,
      icon: Users,
      title: 'Ongoing Support',
      description: 'Continuous maintenance, updates, and support to keep your project thriving.',
      details: 'My commitment doesn\'t end at deployment. I provide ongoing support, regular updates, security patches, and feature enhancements to ensure your project continues to evolve and succeed.'
    }
  ];

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
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="relative py-20 px-4" ref={sectionRef}>
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2 
          className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-gray-400"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}
          initial={{ opacity: 0, y: 30 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Let's Work Together
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ready to bring your ideas to life? I specialize in building scalable, high-performance applications that drive business growth. Let's discuss how we can create something amazing together.
        </motion.p>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={sectionVisible ? "visible" : "hidden"}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={feature.id}
                className="p-8 lg:p-10 rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-slate-400/50 transition-all duration-500 transform hover:-translate-y-2 text-center cursor-pointer"
                style={{ borderRadius: '1rem' }}
                variants={itemVariants}
                onClick={() => setSelectedFeature(feature.id)}
              >
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-slate-500 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300 text-base lg:text-lg">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Feature Modal */}
      {selectedFeature && (() => {
        const feature = features.find(f => f.id === selectedFeature);
        if (!feature) return null;
        const Icon = feature.icon;
        
        return (
          <Modal
            isOpen={!!selectedFeature}
            onClose={() => setSelectedFeature(null)}
            title={feature.title}
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-500 to-gray-500 rounded-2xl flex items-center justify-center">
                  <Icon className="w-10 h-10 text-white" />
                </div>
              </div>

              <div>
                <p 
                  className="text-gray-300 leading-relaxed text-center"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {feature.details}
                </p>
              </div>
            </div>
          </Modal>
        );
      })()}
    </section>
  );
};

