import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, Save, X, Plus, Trash2, Eye, Calendar, Clock, 
  CheckCircle, AlertCircle, Upload, BookOpen, Star
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_name: string;
  featured_image: string | null;
  status: string;
  tags: string[];
  read_time: number;
  views: number;
  is_featured: boolean;
  published_at: string;
  created_at: string;
}

interface BlogTabProps {
  data: any;
  onDataUpdate: () => void;
}

const BlogTab = ({ data: _data, onDataUpdate: _onDataUpdate }: BlogTabProps) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      console.log('Using token:', token ? 'Token exists' : 'No token'); // Debug log
      console.log('Fetching blogs from:', `${API_BASE_URL}/api/user/blogs/`); // Debug log
      const response = await fetch(`${API_BASE_URL}/api/user/blogs/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      console.log('Blogs response status:', response.status); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log('Blogs response data:', data); // Debug log
        const blogsData = data.results || data;
        console.log('Setting blogs:', blogsData); // Debug log
        setBlogs(blogsData);
      } else {
        console.error('Failed to fetch blogs');
        const errorData = await response.json();
        console.error('Error response:', errorData); // Debug log
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.slug?.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }
    
    if (!formData.content?.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.tags || formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingBlog(null);
    setErrors({});
    setSuccessMessage("");
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: null,
      tags: [],
      read_time: 5,
      is_featured: false,
      status: 'draft'
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setIsCreating(false);
    setErrors({});
    setSuccessMessage("");
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      featured_image: blog.featured_image,
      tags: blog.tags,
      read_time: blog.read_time,
      is_featured: blog.is_featured,
      status: blog.status
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = isCreating 
        ? `${API_BASE_URL}/api/blogs/create/`
        : `${API_BASE_URL}/api/blogs/${editingBlog?.id}/update/`;
      
      const method = isCreating ? 'POST' : 'PATCH';

      console.log('Submitting formData:', formData); // Debug log

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchBlogs();
        setIsCreating(false);
        setEditingBlog(null);
        setFormData({});
        setSuccessMessage(isCreating ? "Blog created successfully!" : "Blog updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to save blog' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        await fetchBlogs();
        setSuccessMessage("Blog deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to delete blog' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingBlog(null);
    setFormData({});
    setErrors({});
    setSuccessMessage("");
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ image: 'File size must be less than 5MB' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors({ image: 'Please select an image file' });
        return;
      }
      
      setSelectedFile(file);
      setErrors({ image: '' });
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('featured_image', selectedFile);

      console.log('Uploading image:', selectedFile.name); // Debug log
      console.log('Upload URL:', `${API_BASE_URL}/api/blogs/upload-image/`); // Debug log

      const response = await fetch(`${API_BASE_URL}/api/blogs/upload-image/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        },
        body: formData
      });

      console.log('Upload response status:', response.status); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log('Upload response data:', data); // Debug log
        setFormData((prev: any) => ({ ...prev, featured_image: data.cloudinary_url }));
        setSelectedFile(null);
        setPreviewUrl(null);
        setSuccessMessage("Featured image uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await response.json();
        console.log('Upload error data:', errorData); // Debug log
        setErrors({ image: errorData.error || 'Failed to upload image' });
      }
    } catch (error) {
      console.log('Upload network error:', error); // Debug log
      setErrors({ image: 'Network error. Please try again.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTagChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData((prev: any) => ({ ...prev, tags }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        variants={itemVariants}
      >
        <div>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Blog Management</h3>
          <p className="text-gray-600 mt-1">Create, edit, and manage your blog posts</p>
        </div>
        <Button
          onClick={handleCreate}
          disabled={isCreating || !!editingBlog}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Blog
        </Button>
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-sm"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{errors.submit}</span>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Blog Form */}
      {(isCreating || editingBlog) && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 lg:p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">
                {isCreating ? 'Create New Blog Post' : 'Edit Blog Post'}
              </h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter blog title"
                    className={`text-gray-900 bg-white ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} transition-all duration-200`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Slug *
                  </label>
                  <Input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="blog-post-slug"
                    className={`text-gray-900 bg-white ${errors.slug ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} transition-all duration-200`}
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Excerpt
                  </label>
                  <Textarea
                    value={formData.excerpt || ''}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the blog post"
                    rows={3}
                    className="text-gray-900 bg-white border-gray-300 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Tags *
                  </label>
                  <Input
                    type="text"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => handleTagChange(e.target.value)}
                    placeholder="python, django, web-development"
                    className={`text-gray-900 bg-white ${errors.tags ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} transition-all duration-200`}
                  />
                  {errors.tags && (
                    <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Read Time (minutes)
                    </label>
                    <Input
                      type="number"
                      value={formData.read_time || 5}
                      onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) || 5 })}
                      min="1"
                      max="60"
                      className="text-gray-900 bg-white border-gray-300 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Status
                    </label>
                    <select
                      value={formData.status || 'draft'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured || false}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                    Featured Post
                  </label>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Content *
                  </label>
                  <Textarea
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your blog content here..."
                    rows={12}
                    className={`text-gray-900 bg-white ${errors.content ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} transition-all duration-200`}
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                  )}
                </div>

                {/* Featured Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Featured Image
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="flex-1 text-gray-900 bg-white border-gray-300 focus:border-blue-500 transition-all duration-200"
                    />
                    {selectedFile && (
                      <Button
                        onClick={handleImageUpload}
                        disabled={uploadingImage}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingImage ? 'Uploading...' : 'Upload'}
                      </Button>
                    )}
                  </div>
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                  
                  {/* Image Preview */}
                  {(previewUrl || formData.featured_image) && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="w-32 h-24 rounded-lg overflow-hidden border-2 border-gray-300 shadow-sm">
                        <img 
                          src={previewUrl || formData.featured_image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : (isCreating ? 'Create Blog' : 'Update Blog')}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={loading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Blog List */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 lg:p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Your Blog Posts</h4>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-ping"></div>
              </div>
            </div>
          ) : blogs.length > 0 ? (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/30 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h5 className="font-semibold text-gray-900 text-lg">{blog.title}</h5>
                      <Badge 
                        variant={blog.status === 'published' ? 'default' : 'secondary'}
                        className={blog.status === 'published' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}
                      >
                        {blog.status}
                      </Badge>
                      {blog.is_featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(blog.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {blog.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {blog.read_time} min read
                      </span>
                    </div>
                    {blog.tags.length > 0 && (
                      <div className="flex gap-2">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                            +{blog.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        console.log('Edit button clicked for blog:', blog); // Debug log
                        console.log('isCreating:', isCreating); // Debug log
                        console.log('editingBlog:', editingBlog); // Debug log
                        handleEdit(blog);
                      }}
                      variant="outline"
                      size="sm"
                      disabled={isCreating || !!editingBlog}
                      className="border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 transform hover:scale-105"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(blog.id)}
                      variant="outline"
                      size="sm"
                      disabled={isCreating || !!editingBlog}
                      className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-200 transform hover:scale-105"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 text-lg font-medium">No blog posts yet</p>
              <p className="text-gray-500 text-sm mt-1">Create your first blog post to get started!</p>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BlogTab;
