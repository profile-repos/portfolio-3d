import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminPanel from "@/components/admin/AdminPanel";
import AdminLogin from "@/components/AdminLogin";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setShowLogin(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading admin panel...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AnimatePresence mode="wait">
        {showLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <AdminLogin onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="admin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPanel 
              isOpen={true} 
              onClose={handleLogout} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;

