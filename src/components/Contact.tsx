import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useContactForm } from '@/hooks/use-contact-form';
import type { ProfileData } from '@/services/api';

interface ContactProps {
  profile: ProfileData;
}

export const Contact = ({ profile }: ContactProps) => {
  const {
    formData,
    isSubmitting,
    submitStatus,
    handleInputChange,
    handleSubmit
  } = useContactForm(profile);

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

  const itemVariantsRight = {
    hidden: { opacity: 0, x: 50 },
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
    <section className="relative py-20 px-4 sm:px-6 lg:px-8" ref={sectionRef}>
      <div className="max-w-6xl mx-auto w-full">
        <motion.h2 
          className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-gray-400"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}
          initial={{ opacity: 0, y: 30 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>

        <motion.div 
          className="grid lg:grid-cols-2 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={sectionVisible ? "visible" : "hidden"}
        >
          {/* Contact Info */}
          <motion.div 
            className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 p-6 sm:p-8 lg:p-10 h-full flex flex-col min-w-0"
            style={{ borderRadius: '1rem' }}
            variants={itemVariants}
          >
            <h3 
              className="text-2xl lg:text-3xl font-bold mb-6 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Contact Information
            </h3>
            <p 
              className="text-gray-300 mb-8 leading-relaxed text-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              I'm always excited to discuss new opportunities, innovative projects, and potential collaborations. Whether you have a specific project in mind or just want to explore possibilities, let's start a conversation!
            </p>
            
            <div className="space-y-6 mt-auto">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  <p className="font-semibold text-white text-lg mb-1">Email</p>
                  <a href={`mailto:${profile.user.email}`} className="text-slate-300 hover:text-slate-200 transition-colors block" style={{ wordBreak: 'break-all' }}>
                    {profile.user.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  <p className="font-semibold text-white text-lg mb-1">Phone</p>
                  <a href="tel:+917693813997" className="text-slate-300 hover:text-slate-200 transition-colors block" style={{ wordBreak: 'break-all' }}>
                    +91 76938 13997
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  <p className="font-semibold text-white text-lg mb-1">Location</p>
                  <p className="text-slate-300" style={{ wordBreak: 'break-word' }}>
                    Vijaynagar, Indore (M.P.), 452010
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div 
            className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 p-6 sm:p-8 lg:p-10 h-full flex flex-col min-w-0"
            style={{ borderRadius: '1rem' }}
            variants={itemVariantsRight}
          >
            <h3 
              className="text-2xl lg:text-3xl font-bold mb-6 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Send Message
            </h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-900/50 border border-green-600 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300">Message sent successfully! I'll get back to you soon.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-300">Failed to send message. Please try again or contact me directly.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  name="firstName"
                  placeholder="First Name" 
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                />
                <input 
                  name="lastName"
                  placeholder="Last Name" 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                />
              </div>
              
              <input 
                name="email"
                placeholder="Email Address" 
                type="email" 
                value={formData.email}
                onChange={handleInputChange}
                required
                className="px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
              />
              
              <input 
                name="subject"
                placeholder="Subject" 
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
              />
              
              <textarea 
                name="message"
                placeholder="Tell me about your project, timeline, and any specific requirements..." 
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                required
                className="px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50 resize-none flex-grow"
              />
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-slate-500/50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

