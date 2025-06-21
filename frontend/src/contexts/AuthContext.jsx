import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Check if user is authenticated when component mounts
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
        const role = localStorage.getItem("role");

      if (accessToken) {
        setIsAuthenticated(true);
      
        if (role){
            
            setUserRole(role);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole("");
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = (accessToken, refreshToken, role) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    setIsAuthenticated(true);
    setUserRole(role)
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole('');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
