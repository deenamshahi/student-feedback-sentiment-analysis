import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  LogOut,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("analysis");
  const { logout } = useAuth();

  // Set active item based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/admin-dashboard") setActiveItem("analysis");
    else if (path === "/add-student") setActiveItem("student");
    else if (path === "/teacher-management") setActiveItem("teacher");
    else if (path === "/create-form") setActiveItem("course");
  }, [location.pathname]);

  const handleItemClick = (itemId, path) => {
    setActiveItem(itemId);

    if (itemId === "logout") {
      logout();
    }

    navigate(path);
  };

  const menuItems = [
    {
      id: "analysis",
      label: "Analysis",
      icon: BarChart3,
      path: "/admin-dashboard",
    },
    {
      id: "student",
      label: "Student Management",
      icon: Users,
      path: "/add-student",
    },
    {
      id: "teacher",
      label: "Teacher Management",
      icon: UserCheck,
      path: "/teacher-management",
    },
    {
      id: "course",
      label: "Course Management",
      icon: BookOpen,
      path: "/course-management",
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut,
      path: "/",
      isLogout: true,
    },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-2xl transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">EduPortal</h1>
            <p className="text-sm text-slate-500">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="p-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const isLogout = item.isLogout;

            return (
              <button
                key={item.id}
                onClick={() => {
                  handleItemClick(item.id, item.path);
                  if (isLogout) {
                    // Add your logout logic here
                    // localStorage.removeItem('token');
                  }
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg font-medium transition-all duration-200 text-left ${
                  isActive && !isLogout
                    ? "bg-blue-50 text-blue-700"
                    : isLogout
                    ? "text-red-600 hover:bg-red-50"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive && !isLogout
                      ? "text-blue-700"
                      : isLogout
                      ? "text-red-600"
                      : "text-slate-600"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
