import React, { useState } from 'react';
import { User, Lock, Eye, Settings, Building2, GraduationCap } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onViewNoticeBoard: () => void;
}

export default function Login({ onLogin, onViewNoticeBoard }: LoginProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple admin credentials check
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setTimeout(() => {
        onLogin();
        setIsLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header with Logo */}
      <div className="relative z-10 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-xl shadow-lg p-2 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <img 
              src="https://lh3.googleusercontent.com/d/1HDL9dCyLcmEdlVENo" 
              alt="PCCOE Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-blue-600 rounded-lg items-center justify-center hidden">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">PCCOE</h1>
            <p className="text-blue-200 text-sm">Pimpri Chinchwad College of Engineering</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="max-w-6xl w-full">
          {/* Main Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center space-x-4 mb-6 p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl border border-white border-opacity-20">
              <Building2 className="w-12 h-12 text-blue-300" />
              <div className="text-left">
                <h1 className="text-4xl font-bold text-white mb-2">
                  Computer Engineering Department
                </h1>
                <p className="text-xl text-blue-200">Room Booking System</p>
              </div>
            </div>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Streamlined room reservation system for faculty, students, and administrative staff
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Admin Login Card */}
            <div className="group">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 p-8 hover:bg-opacity-15 transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Admin Portal</h2>
                    <p className="text-blue-200">Manage room bookings and reservations</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-2">
                        Username
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-4 w-5 h-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="text"
                          value={credentials.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-200 transition-all duration-300 hover:bg-opacity-15 focus:bg-opacity-20"
                          placeholder="Enter admin username"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-2">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 w-5 h-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="password"
                          value={credentials.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-200 transition-all duration-300 hover:bg-opacity-15 focus:bg-opacity-20"
                          placeholder="Enter admin password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500 bg-opacity-20 border border-red-400 border-opacity-50 text-red-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Settings className="w-5 h-5" />
                        <span>Access Admin Panel</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 p-4 bg-blue-500 bg-opacity-20 rounded-xl border border-blue-400 border-opacity-30 backdrop-blur-sm">
                  <p className="text-sm text-blue-100">
                    <strong className="text-white">Demo Credentials:</strong><br />
                    Username: <code className="bg-white bg-opacity-20 px-2 py-1 rounded text-blue-200">admin</code><br />
                    Password: <code className="bg-white bg-opacity-20 px-2 py-1 rounded text-blue-200">admin123</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Notice Board Card */}
            <div className="group">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 p-8 hover:bg-opacity-15 transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Notice Board</h2>
                    <p className="text-blue-200">View current room bookings and availability</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-green-500 bg-opacity-20 border border-green-400 border-opacity-50 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-green-100 mb-4 flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5" />
                      <span>For Students & Faculty</span>
                    </h3>
                    <ul className="text-sm text-green-100 space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>View real-time room availability</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Check current and upcoming bookings</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Interactive floor plans with booking status</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>No login required - instant access</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={onViewNoticeBoard}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Notice Board</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 text-blue-200 text-sm bg-white bg-opacity-10 backdrop-blur-sm px-6 py-3 rounded-full border border-white border-opacity-20">
              <Building2 className="w-4 h-4" />
              <span>© 2024 PCCOE Computer Engineering Department. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}