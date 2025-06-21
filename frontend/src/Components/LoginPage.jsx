import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, UserCheck, Users, Eye, EyeOff, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Simulated React Hook Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setApiError('');
      
      // Prepare login data
      const loginData = {
        email: formData.email,
        passwordHash: formData.password,
        role: isAdmin ? '1' : '3'
      };

      // Make API call
      const response = await axios.post('http://localhost:8080/login', loginData);
      console.log('Login response:', response.data.data);

      const  { access_token, refresh_token,role } = response.data.data;
      // Store token in localStorage
      // Use the auth context login method
      
      login( access_token, refresh_token, role);
      console.log("role", role);

      //navigate to the appropriate dashboard based on role
      
      navigate(`/${role}-dashboard`);
      
      
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors (similar to Axios error handling)
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            setApiError(data.message || 'Invalid request data');
            break;
          case 401:
            setApiError('Invalid email or password');
            break;
          case 403:
            setApiError('Access denied. Please check your permissions.');
            break;
          case 404:
            setApiError('Login service not found');
            break;
          case 500:
            setApiError('Server error. Please try again later.');
            break;
          default:
            setApiError(data.message || 'An unexpected error occurred');
        }
      } else if (error.request) {
        // Network error
        setApiError('Network error. Please check your internet connection.');
      } else {
        // Other error
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchToAdmin = () => {
    setIsAdmin(true);
    setApiError('');
    setFormData({ email: '', password: '' });
    setErrors({});
  };

  const switchToStudent = () => {
    setIsAdmin(false);
    setApiError('');
    setFormData({ email: '', password: '' });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">EduPortal</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
        </div>


        {/* Role Toggle */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-center space-x-1 bg-slate-100 rounded-xl p-1">
            <button
              onClick={switchToStudent}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-1 justify-center ${
                !isAdmin 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student</span>
            </button>
            <button
              onClick={switchToAdmin}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-1 justify-center ${
                isAdmin 
                  ? 'bg-white text-purple-600 shadow-md' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
              {isAdmin ? (
                <>
                  <UserCheck className="w-6 h-6 text-purple-600" />
                  <span>Admin Dashboard</span>
                </>
              ) : (
                <>
                  <Users className="w-6 h-6 text-blue-600" />
                  <span>Student Dashboard</span>
                </>
              )}
            </h2>
            <p className="text-slate-600 mt-2">
              {isAdmin 
                ? 'Access the admin dashboard to monitor feedback and analytics'
                : 'You are connecting to Student Feedback Form'
              }
            </p>
          </div>

          <div className="mb-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">SIGN IN</h3>
              <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
            </div>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{apiError}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white ${
                  errors.email 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
                isAdmin
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              } ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  {isAdmin ? <UserCheck className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  <span>Sign in</span>
                </>
              )}
            </button>
          </div>

          {/* Admin Switch (only show for students) */}
          {!isAdmin && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-slate-600 text-sm mb-3">
                  OR If you're ADMIN, please
                </p>
                <button
                  onClick={switchToAdmin}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline transition-colors duration-200 flex items-center space-x-1 mx-auto"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>click here</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Secure login powered by EduPortal
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;