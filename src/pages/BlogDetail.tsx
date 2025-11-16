import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, Calendar, Clock, Eye, Share2, BookOpen } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { API_BASE_URL } from '@/config/api';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_name?: string;
  featured_image: string | null;
  tags: string[];
  read_time: number;
  views: number;
  is_featured: boolean;
  published_at: string;
  created_at: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/blogs/${slug}/`);
      if (response.ok) {
        const result = await response.json();
        const blogData = result.data || result;
        setBlog(blogData);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

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

  if (error || !blog) {
    return (
      <>
        <AnimatedBackground />
        <div className="min-h-screen bg-gray-900 text-white py-20 flex items-center justify-center">
          <div className="text-center">
            <h1 
              className="text-2xl font-bold mb-4 text-red-400"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Error
            </h1>
            <p className="text-gray-400 mb-6">{error || 'Blog post not found'}</p>
            <button
              onClick={() => navigate('/blogs')}
              className="px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white rounded-lg transition-all font-medium border border-slate-400/30"
            >
              <ArrowLeft className="mr-2 w-4 h-4 inline" />
              Back to Blogs
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <button
                onClick={() => navigate('/blogs')}
                className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all"
              >
                <ArrowLeft size={20} />
                Back to Blogs
              </button>
            </motion.div>

            {/* Featured Image */}
            {blog.featured_image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8 rounded-2xl overflow-hidden"
                style={{ borderRadius: '1rem' }}
              >
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                </div>
              </motion.div>
            )}

            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-500/20 rounded-full text-xs border border-slate-400/30">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 
                className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-gray-400"
                style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}
              >
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10" style={{ borderRadius: '1rem' }}>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(blog.published_at || blog.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{blog.read_time} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{blog.views} views</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {blog.is_featured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-semibold text-white">
                      Featured
                    </span>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>

              {/* Excerpt */}
              {blog.excerpt && (
                <div className="mb-8 p-6 rounded-2xl bg-slate-500/10 border border-slate-400/20" style={{ borderRadius: '1rem' }}>
                  <p 
                    className="text-lg text-slate-200 italic"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    "{blog.excerpt}"
                  </p>
                </div>
              )}

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="markdown-content"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ children }) => (
                      <h1 
                        className="text-3xl font-bold text-white mb-6 mt-8 first:mt-0"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 
                        className="text-2xl font-bold text-white mb-4 mt-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 
                        className="text-xl font-bold text-white mb-3 mt-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 
                        className="text-lg font-bold text-white mb-2 mt-3"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p 
                        className="text-gray-300 leading-relaxed mb-4"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 ml-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2 ml-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-slate-400 pl-4 italic text-gray-300 my-4 bg-slate-500/10 py-2 rounded-r" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a 
                        href={href} 
                        className="text-slate-400 hover:text-slate-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ node, inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="relative my-4">
                          <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                            {match[1]}
                          </div>
                          <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      ) : (
                        <code className="bg-gray-800 text-slate-300 px-2 py-1 rounded text-sm" {...props}>
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto my-4">
                        {children}
                      </pre>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border border-gray-700 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-700 px-4 py-2 bg-gray-800 text-white font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-700 px-4 py-2 text-gray-300">
                        {children}
                      </td>
                    ),
                    hr: () => (
                      <hr className="border-gray-700 my-8" />
                    ),
                    img: ({ src, alt }) => (
                      <img 
                        src={src} 
                        alt={alt} 
                        className="rounded-lg my-4 max-w-full h-auto"
                        style={{ borderRadius: '0.5rem' }}
                      />
                    ),
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </motion.div>

              {/* Article Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-12 pt-8 border-t border-white/10"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-gray-500 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Written by</p>
                      <p className="font-semibold text-white">{blog.author_name || 'Vishal Chouhan'}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate('/blogs')}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white rounded-lg transition-all font-medium border border-slate-400/30"
                  >
                    <ArrowLeft size={18} />
                    Back to Blogs
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;

