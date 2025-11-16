import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ExternalLink,
  Link,
  Instagram,
  Github,
  Linkedin,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface SocialLinksTabProps {
  data: any;
  onDataUpdate: () => void;
}

const SocialLinksTab = ({ data, onDataUpdate }: SocialLinksTabProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState("");

  const platformOptions = [
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { value: 'telegram', label: 'Telegram', icon: MessageCircle },
    { value: 'twitter', label: 'Twitter', icon: ExternalLink },
    { value: 'facebook', label: 'Facebook', icon: ExternalLink },
    { value: 'youtube', label: 'YouTube', icon: ExternalLink },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'website', label: 'Website', icon: Globe },
    { value: 'portfolio', label: 'Portfolio', icon: Globe },
    { value: 'resume', label: 'Resume', icon: ExternalLink },
    { value: 'naukari', label: 'Naukri', icon: ExternalLink },
  ];

  const getPlatformIcon = (platform: string) => {
    const option = platformOptions.find(opt => opt.value === platform);
    return option ? option.icon : ExternalLink;
  };

  const getUrlPlaceholder = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'https://instagram.com/yourusername';
      case 'github':
        return 'https://github.com/yourusername';
      case 'linkedin':
        return 'https://linkedin.com/in/yourusername';
      case 'whatsapp':
        return 'https://wa.me/yourphonenumber';
      case 'telegram':
        return 'https://t.me/yourusername';
      case 'twitter':
        return 'https://twitter.com/yourusername';
      case 'facebook':
        return 'https://facebook.com/yourusername';
      case 'youtube':
        return 'https://youtube.com/@yourchannel';
      case 'email':
        return 'mailto:your.email@example.com';
      case 'phone':
        return 'tel:+1234567890';
      case 'website':
        return 'https://yourwebsite.com';
      case 'portfolio':
        return 'https://yourportfolio.com';
      case 'resume':
        return 'https://drive.google.com/file/d/your-resume-id';
      case 'naukari':
        return 'https://www.naukri.com/your-profile';
      default:
        return 'https://example.com';
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.platform?.trim()) {
      newErrors.platform = "Platform is required";
    }
    
    if (!formData.url?.trim()) {
      newErrors.url = "URL is required";
    } else {
      const url = formData.url.trim();
      const platform = formData.platform?.toLowerCase();
      
      if (platform === 'whatsapp' && !url.startsWith('https://wa.me/') && !url.startsWith('https://api.whatsapp.com/')) {
        newErrors.url = "WhatsApp URLs should start with https://wa.me/ or https://api.whatsapp.com/";
      } else if (platform === 'telegram' && !url.startsWith('https://t.me/') && !url.startsWith('https://telegram.me/')) {
        newErrors.url = "Telegram URLs should start with https://t.me/ or https://telegram.me/";
      } else if (platform === 'email' && !url.startsWith('mailto:')) {
        newErrors.url = "Email URLs should start with mailto:";
      } else if (platform === 'phone' && !url.startsWith('tel:')) {
        newErrors.url = "Phone URLs should start with tel:";
      } else if (platform && !['email', 'phone'].includes(platform) && !url.startsWith('http')) {
        newErrors.url = "URL should start with http:// or https://";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    setIsEditing('new');
    setFormData({
      platform: '',
      url: '',
      is_active: true
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleEdit = (link: any) => {
    setIsEditing(`edit-${link.id}`);
    setFormData({
      id: link.id,
      platform: link.platform,
      url: link.url,
      is_active: link.is_active
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userId = 1;
      const isEditing = formData.id;
      const endpoint = isEditing 
        ? `/api/users/${userId}/social-links/${formData.id}/`
        : `/api/users/${userId}/social-links/`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await onDataUpdate();
        setIsEditing(null);
        setFormData({});
        setSuccessMessage(isEditing ? "Social link updated successfully!" : "Social link added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to save social link' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (linkId: number) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;
    
    setLoading(true);
    try {
      const userId = 1;
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/social-links/${linkId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        await onDataUpdate();
        setSuccessMessage("Social link deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrors({ submit: 'Failed to delete social link' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({});
    setErrors({});
    setSuccessMessage("");
  };

  const handlePlatformChange = (platform: string) => {
    setFormData({ ...formData, platform });
    setErrors({ ...errors, platform: undefined, url: undefined });
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

  const socialLinks = data?.social_links || [];

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
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Social Media Links</h3>
          <p className="text-gray-600 mt-1">Manage your social media and contact links</p>
        </div>
        <Button
          onClick={handleAdd}
          disabled={isEditing !== null}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Social Link
        </Button>
      </motion.div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{errors.submit}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Links Grid */}
      {socialLinks.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          variants={itemVariants}
        >
          <Link className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No social links found</h4>
          <p className="text-gray-500 mb-4">Get started by adding your first social media link</p>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Link
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialLinks.map((link: any) => {
            const IconComponent = getPlatformIcon(link.platform);
            return (
              <motion.div
                key={link.id}
                variants={itemVariants}
                className="group"
              >
                <Card className="p-6 h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {link.platform}
                        </h4>
                        <p className="text-sm text-gray-500">Social Link</p>
                      </div>
                    </div>
                    <Badge 
                      variant={link.is_active ? "default" : "secondary"}
                      className={`${link.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {link.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all hover:underline"
                    >
                      {link.url}
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(link)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
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
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isEditing === 'new' ? 'Add Social Link' : 'Edit Social Link'}
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Platform <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.platform || ''}
                    onValueChange={handlePlatformChange}
                  >
                    <SelectTrigger className={`text-gray-900 bg-white ${errors.platform ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {platformOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value} className="text-gray-900 focus:bg-gray-100">
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.platform && (
                    <p className="text-red-500 text-sm mt-1">{errors.platform}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    URL <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.url || ''}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className={`text-gray-900 bg-white ${errors.url ? 'border-red-500' : ''}`}
                    placeholder={getUrlPlaceholder(formData.platform)}
                  />
                  {errors.url && (
                    <p className="text-red-500 text-sm mt-1">{errors.url}</p>
                  )}
                  {formData.platform && !errors.url && (
                    <p className="text-gray-500 text-sm mt-1">
                      Example: {getUrlPlaceholder(formData.platform)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-1 sm:flex-none"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Link'}
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

export default SocialLinksTab; 