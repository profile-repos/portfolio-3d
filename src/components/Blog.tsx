import { useState } from 'react';
import { BookOpen, Calendar, Clock, Eye, ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Modal } from './Modal';
import { formatBlogDate } from '@/utils/helpers';
import type { BlogPost } from '@/types';

interface BlogProps {
  blogs: BlogPost[];
  mousePosition: { x: number; y: number };
}

export const Blog = ({ blogs, mousePosition }: BlogProps) => {
  const [selectedBlog, setSelectedBlog] = useState<number | null>(null);
  const navigate = useNavigate();
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({ triggerOnce: true });

  if (blogs.length === 0) return null;

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
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-slate-500 to-gray-500 rounded-xl flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={sectionVisible ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          <h2 
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-gray-400"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}
          >
            Latest Blogs
          </h2>
          <p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Explore my latest thoughts on technology, development, and industry insights.
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={sectionVisible ? "visible" : "hidden"}
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 p-6 hover:border-slate-400/50 transition-all duration-500 hover:scale-105 h-full flex flex-col cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateY(${mousePosition.x * 2}deg) rotateX(${-mousePosition.y * 2}deg)`,
                borderRadius: '1rem',
              }}
              variants={itemVariants}
              onClick={() => setSelectedBlog(blog.id)}
            >
              {blog.featured_image && (
                <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  {blog.is_featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-semibold text-white">
                      Featured
                    </div>
                  )}
                </div>
              )}

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-slate-500/20 rounded-full text-xs border border-slate-400/30">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h3 
                className="text-xl font-bold mb-3 text-white group-hover:text-slate-300 transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {blog.title}
              </h3>

              <p 
                className="text-gray-300 mb-4 flex-grow text-sm line-clamp-3"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {blog.excerpt}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatBlogDate(blog.published_at || blog.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views} views</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{blog.read_time} min read</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Show More Blogs Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={() => navigate('/blogs')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-slate-500/50 font-semibold"
          >
            <BookOpen size={20} />
            Show More Blogs
          </button>
        </motion.div>
      </div>

      {/* Blog Modal */}
      {selectedBlog && (() => {
        const blog = blogs.find(b => b.id === selectedBlog);
        if (!blog) return null;
        
        return (
          <Modal
            isOpen={!!selectedBlog}
            onClose={() => setSelectedBlog(null)}
            title={blog.title}
          >
            <div className="p-6 space-y-6">
              {blog.featured_image && (
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  {blog.is_featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-semibold text-white">
                      Featured
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatBlogDate(blog.published_at || blog.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{blog.read_time} min read</span>
                </div>
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-500/20 rounded-full text-xs border border-slate-400/30">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <p 
                  className="text-gray-300 leading-relaxed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {blog.excerpt}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlog(null);
                    navigate(`/blogs/${blog.slug}`);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white rounded-lg transition-all font-medium border border-slate-400/30"
                >
                  <ExternalLink size={18} />
                  Read Full Article
                </button>
              </div>
            </div>
          </Modal>
        );
      })()}
    </section>
  );
};

