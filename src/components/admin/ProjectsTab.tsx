import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ExternalLink, 
  Github, 
  Briefcase,
  Code,
  CheckCircle,
  AlertCircle,
  Search,
  Filter
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { useLoading } from "@/contexts/LoadingContext";

interface ProjectsTabProps {
  data: any;
  onDataUpdate: () => void;
}

const ProjectsTab = ({ data: _data, onDataUpdate: _onDataUpdate }: ProjectsTabProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState("");
  const { setLoading: setGlobalLoading } = useLoading();

  const fetchProjects = async () => {
    setFetching(true);
    setGlobalLoading(true, "Loading projects...");
    try {
      const token = localStorage.getItem('admin_token');
      const userId = 1;
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/projects/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Projects API response:', data);
        
        if (data.results && Array.isArray(data.results)) {
          console.log('Setting projects from results:', data.results.length);
          setProjects(data.results);
        } else if (Array.isArray(data)) {
          console.log('Setting projects from array:', data.length);
          setProjects(data);
        } else {
          console.warn('Unexpected data structure:', data);
          setProjects([]);
        }
      } else {
        console.error('Error fetching projects:', response.statusText);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setFetching(false);
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = "Project title is required";
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = "Project description is required";
    }
    
    if (!formData.role?.trim()) {
      newErrors.role = "Your role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    setIsEditing('new');
    setFormData({
      title: '',
      description: '',
      role: '',
      technologies: '',
      github_url: '',
      project_url: '',
      is_active: true
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleEdit = (project: any) => {
    setIsEditing(`edit-${project.id}`);
    setFormData({
      id: project.id,
      title: project.title,
      description: project.description,
      role: project.role,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies,
      github_url: project.github_url,
      project_url: project.project_url,
      is_active: project.is_active
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setGlobalLoading(true, formData.id ? "Updating project..." : "Creating project...");
    try {
      const userId = 1;
      const isEditing = formData.id;
      const endpoint = isEditing 
        ? `/api/users/${userId}/projects/${formData.id}/`
        : `/api/users/${userId}/projects/`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const submitData = {
        ...formData,
        technologies: formData.technologies ? formData.technologies.split(',').map((tech: string) => tech.trim()) : [],
        is_active: formData.is_active
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        await fetchProjects();
        setIsEditing(null);
        setFormData({});
        setSuccessMessage(isEditing ? "Project updated successfully!" : "Project added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to save project' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    setGlobalLoading(true, "Deleting project...");
    try {
      const userId = 1;
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/projects/${projectId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        await fetchProjects();
        setSuccessMessage("Project deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrors({ submit: 'Failed to delete project' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({});
    setErrors({});
    setSuccessMessage("");
  };

  const filteredProjects = projects.filter(project => {
    if (!project) return false;
    
    const matchesSearch = !searchTerm || 
                         project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.role?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterActive === null || project.is_active === filterActive;
    
    return matchesSearch && matchesFilter;
  });

  // Debug logging
  useEffect(() => {
    if (projects.length > 0) {
      console.log('Projects in state:', projects.length);
      console.log('Filtered projects:', filteredProjects.length);
      console.log('First project:', projects[0]);
    }
  }, [projects, filteredProjects]);

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
      style={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        variants={itemVariants}
      >
        <div>
          <h3 
            className="text-2xl lg:text-3xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Projects
          </h3>
          <p 
            className="text-gray-300 mt-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Manage your portfolio projects
          </p>
        </div>
        <Button
          onClick={handleAdd}
          disabled={isEditing !== null}
          className="w-full sm:w-auto bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white border border-slate-400/30 shadow-lg shadow-slate-500/50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </motion.div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-900/50 border border-green-600/50 rounded-lg p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-900/50 border border-red-600/50 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{errors.submit}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        variants={itemVariants}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-white bg-gray-800/50 border-gray-700/50 focus:border-blue-500/50 focus:ring-blue-500/20 placeholder:text-gray-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterActive === null ? 'all' : filterActive.toString()}
            onChange={(e) => setFilterActive(e.target.value === 'all' ? null : e.target.value === 'true')}
            className="border border-gray-700/50 rounded-md px-3 py-2 text-sm bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          >
            <option value="all" className="bg-gray-800">All Projects</option>
            <option value="true" className="bg-gray-800">Active Only</option>
            <option value="false" className="bg-gray-800">Inactive Only</option>
          </select>
        </div>
      </motion.div>

      {/* Projects Grid */}
      {fetching ? (
        <motion.div 
          className="flex items-center justify-center h-64"
          variants={itemVariants}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mx-auto mb-4"></div>
            <p className="text-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>Loading projects...</p>
          </div>
        </motion.div>
      ) : filteredProjects.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          variants={itemVariants}
        >
          <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h4 
            className="text-lg font-medium text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            No projects found
          </h4>
          <p 
            className="text-gray-400 mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {searchTerm || filterActive !== null 
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first project"
            }
          </p>
          {!searchTerm && filterActive === null && (
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ opacity: 1 }}
        >
          {filteredProjects.map((project, index) => {
            if (!project || !project.id) {
              console.warn('Invalid project at index', index, project);
              return null;
            }
            return (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group"
            >
              <Card className="p-6 h-full border border-gray-700/50 shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 
                      className="text-lg font-semibold text-white mb-2 line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {project.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <Code className="w-4 h-4 text-blue-400" />
                      <span>{project.role}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={project.is_active ? "default" : "secondary"}
                    className={`${project.is_active ? 'bg-green-500/20 text-green-300 border border-green-500/50' : 'bg-gray-700/50 text-gray-400 border border-gray-600/50'}`}
                  >
                    {project.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <p 
                  className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {project.description}
                </p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech: string, techIndex: number) => (
                      <Badge key={techIndex} variant="outline" className="text-xs border-blue-500/50 text-blue-300 bg-blue-500/10">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-600/50 text-gray-400 bg-gray-700/30">
                        +{project.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
                  <div className="flex gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity border-blue-500/50 text-blue-300 hover:text-white hover:bg-blue-500/20 hover:border-blue-400"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity border-red-500/50 text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Edit/Add Form Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isEditing === 'new' ? 'Add New Project' : 'Edit Project'}
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className={`text-gray-900 bg-white ${errors.title ? 'border-red-500' : ''}`}
                      placeholder="Enter project title"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Your Role <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.role || ''}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className={`text-gray-900 bg-white ${errors.role ? 'border-red-500' : ''}`}
                      placeholder="e.g., Full Stack Developer"
                    />
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`text-gray-900 bg-white ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe your project..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Technologies
                  </label>
                  <Input
                    value={formData.technologies || ''}
                    onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                    className="text-gray-900 bg-white"
                    placeholder="React, Node.js, Python (comma separated)"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      GitHub URL
                    </label>
                    <Input
                      value={formData.github_url || ''}
                      onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                      className="text-gray-900 bg-white"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Live URL
                    </label>
                    <Input
                      value={formData.project_url || ''}
                      onChange={(e) => setFormData({...formData, project_url: e.target.value})}
                      className="text-gray-900 bg-white"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked: boolean) => setFormData({...formData, is_active: checked})}
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Active Project
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-1 sm:flex-none"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Project'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectsTab; 