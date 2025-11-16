import { useState, useEffect } from 'react';
import type { BlogPost } from '@/types';
import { API_BASE_URL } from '@/config/api';

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/blogs/?limit=3&ordering=-views,-created_at`);
        
        if (response.ok) {
          const data = await response.json();
          const blogResults = data.results || data;
          setBlogs(Array.isArray(blogResults) ? blogResults.slice(0, 3) : []);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return { blogs, blogsLoading };
};

