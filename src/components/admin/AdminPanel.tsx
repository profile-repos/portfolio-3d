import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Briefcase, 
  Code, 
  Link, 
  Settings,
  X,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Bell,
  Search,
  BookOpen
} from "lucide-react";
import ProfileTab from "./ProfileTab";
import ProjectsTab from "./ProjectsTab";
import SkillsTab from "./SkillsTab";
import SocialLinksTab from "./SocialLinksTab";
import ExperienceTab from "./ExperienceTab";
import BlogTab from "./BlogTab";
import { API_BASE_URL } from "@/config/api";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Profile updated successfully", type: "success", time: "2 min ago" },
    { id: 2, message: "New project added", type: "info", time: "1 hour ago" }
  ]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const userId = 1;
      
      const profileResponse = await fetch(`${API_BASE_URL}/api/users/${userId}/profile/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });
      
      const profileData = profileResponse.ok ? await profileResponse.json() : {};
      setData(profileData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    { value: "profile", label: "Profile", icon: Users },
    { value: "projects", label: "Projects", icon: Briefcase },
    { value: "skills", label: "Skills", icon: Code },
    { value: "social", label: "Social Links", icon: Link },
    { value: "experience", label: "Experience", icon: Users },
    { value: "blog", label: "Blog", icon: BookOpen }
  ];

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
    <div className="min-h-screen admin-panel admin-light">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen flex flex-col"
      >
        {/* Header */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-lg relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="flex items-center justify-between p-4 lg:p-6 relative z-10">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white hover:bg-white/20 transition-all duration-200"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Settings className="w-6 h-6 lg:w-7 lg:h-7" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold">Admin Panel</h2>
                <p className="text-blue-100 text-sm hidden sm:block">Manage your portfolio content</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchData}
                disabled={loading}
                className="text-white hover:bg-white/20 transition-all duration-200 hidden sm:flex"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 transition-all duration-200 relative"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {notifications.length}
                    </span>
                  )}
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <motion.div
            className={`bg-gray-800/95 backdrop-blur-sm shadow-xl border-r border-gray-700/50 transition-all duration-300 ${
              sidebarCollapsed ? 'w-16' : 'w-64'
            } ${
              mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 lg:relative' : 'hidden lg:block'
            }`}
            variants={itemVariants}
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Toggle */}
              <div className="p-4 border-b border-gray-700/50 hidden lg:block">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="w-full justify-center hover:bg-gray-700/50 text-gray-300 transition-all duration-200"
                >
                  {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
              </div>

              {/* Tab Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-2">
                  {tabItems.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="flex items-center gap-3 justify-start h-12 px-3 rounded-lg text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-gray-700/50 hover:text-white hover:scale-105"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="truncate font-medium">{tab.label}</span>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto bg-gray-900">
            <div className="p-4 lg:p-6">
              {loading ? (
                <motion.div 
                  className="flex items-center justify-center h-64"
                  variants={itemVariants}
                >
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-ping"></div>
                    </div>
                    <p className="text-gray-700 text-lg font-medium">Loading data...</p>
                    <p className="text-gray-500 text-sm">Please wait while we fetch your content</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsContent value="profile" className="mt-0">
                      <ProfileTab data={data} onDataUpdate={fetchData} />
                    </TabsContent>
                    <TabsContent value="projects" className="mt-0">
                      <ProjectsTab data={data} onDataUpdate={fetchData} />
                    </TabsContent>
                    <TabsContent value="skills" className="mt-0">
                      <SkillsTab data={data} onDataUpdate={fetchData} />
                    </TabsContent>
                    <TabsContent value="social" className="mt-0">
                      <SocialLinksTab data={data} onDataUpdate={fetchData} />
                    </TabsContent>
                    <TabsContent value="experience" className="mt-0">
                      <ExperienceTab data={data} onDataUpdate={fetchData} />
                    </TabsContent>
                    <TabsContent value="blog" className="mt-0">
                      <BlogTab data={data} onDataUpdate={fetchData} />
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
