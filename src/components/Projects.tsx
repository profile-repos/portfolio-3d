import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Modal } from './Modal';
import type { ProfileData } from '@/services/api';

interface ProjectsProps {
  profile: ProfileData;
}

export const Projects = ({ profile }: ProjectsProps) => {
  const [currentProjectPage, setCurrentProjectPage] = useState(0);
  const [projectsPerPage, setProjectsPerPage] = useState(3);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({ triggerOnce: true });

  // Force animation when page changes
  useEffect(() => {
    setShouldAnimate(false);
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [currentProjectPage]);

  // Responsive pagination for projects (1 on mobile, 3 on larger screens)
  useEffect(() => {
    const updateProjectsPerPage = () => {
      const newProjectsPerPage = window.innerWidth < 768 ? 1 : 3;
      setProjectsPerPage(newProjectsPerPage);
      setCurrentProjectPage(0);
    };
    
    updateProjectsPerPage();
    window.addEventListener('resize', updateProjectsPerPage);
    
    return () => window.removeEventListener('resize', updateProjectsPerPage);
  }, []);

  // Reset to first page when projects change or projectsPerPage changes
  useEffect(() => {
    const activeProjects = profile.projects.filter(p => p.is_active);
    const totalPages = Math.ceil(activeProjects.length / projectsPerPage);
    if (totalPages > 0 && currentProjectPage >= totalPages) {
      setCurrentProjectPage(0);
    }
  }, [profile.projects, projectsPerPage, currentProjectPage]);

  // Filter active projects and sort by id (newest first)
  const activeProjects = profile.projects
    ?.filter(p => p.is_active)
    .sort((a, b) => b.id - a.id) || [];

  const totalProjectPages = activeProjects.length > 0 ? Math.ceil(activeProjects.length / projectsPerPage) : 1;
  const startIndex = currentProjectPage * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = activeProjects.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentProjectPage((prev) => (prev + 1) % totalProjectPages);
  };

  const goToPrevPage = () => {
    setCurrentProjectPage((prev) => (prev - 1 + totalProjectPages) % totalProjectPages);
  };

  const goToPage = (page: number) => {
    setCurrentProjectPage(page);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section className="relative py-20 px-4" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-gray-400"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}
          initial={{ opacity: 0, y: 30 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>
        
        {/* Projects Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {totalProjectPages > 1 && (
            <>
              <button
                onClick={goToPrevPage}
                className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110 border border-white/20"
                aria-label="Previous projects"
              >
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              </button>
              <button
                onClick={goToNextPage}
                className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110 border border-white/20"
                aria-label="Next projects"
              >
                <ChevronRight size={20} className="md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Projects Grid */}
          <motion.div 
            key={`projects-page-${currentProjectPage}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500"
            variants={containerVariants}
            initial="hidden"
            animate={(sectionVisible && shouldAnimate) ? "visible" : "hidden"}
          >
            {currentProjects.length > 0 ? currentProjects.map((project) => {
              return (
                <motion.div 
                  key={project.id}
                  className="group relative transition-all duration-500 hover:scale-105 hover:z-10"
                  variants={itemVariants}
                >
                  {/* Popup shadow on hover */}
                  <div className="absolute -inset-2 rounded-2xl bg-slate-500/0 group-hover:bg-slate-500/20 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100 -z-10"></div>
                  
                  {/* Card Container */}
                  <div 
                    className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 p-8 h-full hover:border-slate-400/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-500/30 cursor-pointer"
                    style={{ borderRadius: '1rem' }}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    {/* Hover background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-gray-500/0 group-hover:from-slate-500/10 group-hover:to-gray-500/10 transition-all duration-500" style={{ borderRadius: '1rem' }}></div>
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col text-center md:text-left">
                      <div className="mb-4">
                        <h3 
                          className="text-xl md:text-2xl font-bold mb-2"
                          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.01em' }}
                        >
                          {project.title}
                        </h3>
                        <p 
                          className="text-slate-300 mb-2 text-sm md:text-base"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {project.role}
                        </p>
                        <p 
                          className="text-gray-300 leading-relaxed mb-4 text-sm md:text-base"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {project.description}
                        </p>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                          {project.technologies.slice(0, 4).map((tech, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-500/20 rounded-full text-xs md:text-sm border border-slate-400/30">
                              {tech}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 justify-center md:justify-start flex-wrap">
                          {project.project_url && (
                            <a 
                              href={project.project_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-block px-4 py-2 bg-slate-600/30 hover:bg-slate-600/50 rounded-lg transition-all text-white font-medium border border-slate-400/30 text-sm md:text-base"
                            >
                              View Project →
                            </a>
                          )}
                          {project.github_url && (
                            <a 
                              href={project.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-block px-4 py-2 bg-slate-600/30 hover:bg-slate-600/50 rounded-lg transition-all text-white font-medium border border-slate-400/30 text-sm md:text-base"
                            >
                              GitHub →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No projects found on this page.</p>
              </div>
            )}
          </motion.div>

          {/* Pagination Dots */}
          {totalProjectPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalProjectPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentProjectPage === index
                      ? 'bg-slate-400 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Page Indicator */}
          {totalProjectPages > 1 && (
            <div className="text-center mt-4 text-gray-400 text-sm">
              Page {currentProjectPage + 1} of {totalProjectPages}
            </div>
          )}
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (() => {
        const project = activeProjects.find(p => p.id === selectedProject);
        if (!project) return null;
        
        return (
          <Modal
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
            title={project.title}
          >
            <div className="p-6 space-y-6">
              <div>
                <p 
                  className="text-slate-300 text-lg mb-4"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {project.role}
                </p>
                <p 
                  className="text-gray-300 leading-relaxed text-base"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {project.description}
                </p>
              </div>

              <div>
                <h3 
                  className="text-xl font-bold mb-4 text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-500/20 rounded-full text-sm border border-slate-400/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {(project.project_url || project.github_url) && (
                <div className="flex gap-4 pt-4">
                  {project.project_url && (
                    <a 
                      href={project.project_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white rounded-lg transition-all font-medium border border-slate-400/30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={18} />
                      View Project
                    </a>
                  )}
                  {project.github_url && (
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white rounded-lg transition-all font-medium border border-slate-400/30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github size={18} />
                      View Code
                    </a>
                  )}
                </div>
              )}
            </div>
          </Modal>
        );
      })()}
    </section>
  );
};

