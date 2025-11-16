import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, Eye, ArrowRight, BookOpen, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import type { BlogPost } from '@/types';
import { formatBlogDate } from '@/utils/helpers';
import { API_BASE_URL } from '@/config/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [featuredBlog, setFeaturedBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeatured, setShowFeatured] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  
  const blogsPerPage = 9;

  useEffect(() => {
    fetchFeaturedBlog();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [searchQuery, showFeatured, currentPage, featuredBlog]);

  const fetchFeaturedBlog = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/featured/`);
      if (response.ok) {
        const result = await response.json();
        const blogData = result.data || result;
        setFeaturedBlog(blogData);
      }
    } catch (error) {
      console.error('Error fetching featured blog:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/api/blogs/`;
      const params = new URLSearchParams();
      
      params.append('page', currentPage.toString());
      params.append('page_size', blogsPerPage.toString());
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (showFeatured) {
        params.append('featured', 'true');
      }
      if (featuredBlog) {
        params.append('exclude_featured', 'true');
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const blogResults = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
        setBlogs(blogResults);
        setTotalPages(data.total_pages || 1);
      } else {
        console.error('Failed to fetch blogs');
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (slug: string) => {
    navigate(`/blogs/${slug}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setShowFeatured(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const regularBlogs = blogs || [];

  if (loading) {
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen bg-gray-900 text-white py-20 flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen bg-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h1 
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-gray-400"
                style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}
              >
                Blogs
              </h1>
              <p 
                className="text-xl text-gray-300 max-w-2xl mx-auto"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Thoughts, tutorials, and insights about technology, development, and everything in between.
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div variants={itemVariants} className="mb-8">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                  />
                </div>
                
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white rounded-lg transition-all font-medium border border-slate-400/30"
                >
                  Search
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowFeatured(!showFeatured)}
                  className={`px-6 py-3 rounded-lg transition-all font-medium border ${
                    showFeatured
                      ? 'bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white border-slate-400/30'
                      : 'bg-white/5 text-gray-300 border-white/20 hover:border-slate-400/50'
                  }`}
                >
                  {showFeatured ? 'Show All' : 'Featured Only'}
                </button>
              </form>
            </motion.div>

            {/* Featured Blog */}
            {featuredBlog && (
              <motion.div variants={itemVariants} className="mb-16">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <h2 
                      className="text-2xl font-bold text-yellow-400"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Featured Post
                    </h2>
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-yellow-500/50 transition-all duration-300"
                  style={{ borderRadius: '1rem' }}
                  onClick={() => handleBlogClick(featuredBlog.slug)}
                >
                  <div className="grid lg:grid-cols-3 gap-0">
                    {featuredBlog.featured_image && (
                      <div className="relative h-64 lg:h-full overflow-hidden">
                        <img
                          src={featuredBlog.featured_image}
                          alt={featuredBlog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                        {featuredBlog.is_featured && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-semibold text-white">
                            Featured
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-8 flex flex-col justify-center lg:col-span-2">
                      {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {featuredBlog.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-slate-500/20 rounded-full text-xs border border-slate-400/30">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <h3 
                        className="text-2xl lg:text-3xl font-bold mb-4 text-white group-hover:text-slate-300 transition-colors"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {featuredBlog.title}
                      </h3>

                      <p 
                        className="text-gray-300 mb-6 line-clamp-4"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {featuredBlog.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatBlogDate(featuredBlog.published_at || featuredBlog.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{featuredBlog.views}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{featuredBlog.read_time} min read</span>
                        </div>
                        
                        <button className="text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 px-4 py-2 rounded-lg transition-all group">
                          Read More
                          <ArrowRight className="ml-2 w-4 h-4 inline group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Regular Blog Posts Grid */}
            {regularBlogs && regularBlogs.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="text-center mb-8">
                  <h2 
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    All Posts
                  </h2>
                  <p className="text-gray-400">Explore more articles and insights</p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {regularBlogs.map((blog) => (
                    <motion.div
                      key={blog.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="group cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-slate-400/50 transition-all duration-500 h-full flex flex-col"
                      style={{ borderRadius: '1rem' }}
                      onClick={() => handleBlogClick(blog.slug)}
                    >
                      {blog.featured_image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={blog.featured_image}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                        </div>
                      )}

                      <div className="p-6 flex flex-col flex-grow">
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-slate-500/20 rounded-full text-xs border border-slate-400/30">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3 
                          className="text-xl font-bold mb-3 text-white group-hover:text-slate-300 transition-colors line-clamp-2"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {blog.title}
                        </h3>

                        <p 
                          className="text-gray-300 mb-4 line-clamp-3 flex-grow"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {blog.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatBlogDate(blog.published_at || blog.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{blog.views}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{blog.read_time} min read</span>
                          </div>
                          
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* No Blogs Found */}
            {(!blogs || blogs.length === 0) && (
              <motion.div variants={itemVariants} className="text-center py-12">
                <div className="text-gray-400 text-lg">
                  {searchQuery || showFeatured 
                    ? 'No blogs found matching your criteria.' 
                    : 'No blogs published yet.'}
                </div>
                {(searchQuery || showFeatured) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white rounded-lg transition-all font-medium border border-slate-400/30"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div variants={itemVariants} className="mt-12">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-slate-600 to-gray-600 text-white border border-slate-400/30'
                            : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                <div className="text-center mt-4 text-gray-400 text-sm">
                  Page {currentPage} of {totalPages}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Blogs;

