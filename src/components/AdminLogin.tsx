import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('admin_token', data.token);
        onLogin(data.token);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-xl rounded-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-slate-500 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h2 
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-gray-400"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Admin Login
          </h2>
          <p className="text-gray-300 mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Username
            </label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              className="bg-white/5 text-white border-white/20 placeholder:text-gray-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="bg-white/5 text-white border-white/20 placeholder:text-gray-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-white/10 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-600 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white border border-slate-400/30 shadow-lg shadow-slate-500/50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;

