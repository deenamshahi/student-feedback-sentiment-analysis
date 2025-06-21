import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  MessageSquare,
  GraduationCap,
  LogOut,
  Home,
  Star
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const StudentSidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("dashboard");
  const { logout } = useAuth();

  // Set active item based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/student-dashboard") setActiveItem("dashboard");
    else if (path === "/my-courses") setActiveItem("courses");
    else if (path === "/feedback") setActiveItem("feedback");
  }, [location.pathname]);

  const handleItemClick = (itemId, path) => {
    setActiveItem(itemId);

    if (itemId === "logout") {
      logout();
      navigate("/");
      return;
    }

    navigate(path);
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/student-dashboard",
    },
    {
      id: "courses",
      label: "My Courses",
      icon: BookOpen,
      path: "/my-courses",
    },
    {
      id: "feedback",
      label: "Give Feedback",
      icon: MessageSquare,
      path: "/feedback",
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
          <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">EduPortal</h1>
            <p className="text-sm text-slate-500">Student Dashboard</p>
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
                onClick={() => handleItemClick(item.id, item.path)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg font-medium transition-all duration-200 text-left ${
                  isActive && !isLogout
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200"
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

        {/* Student Info Section */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Quick Stats</p>
              <p className="text-xs text-slate-600">This Semester</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">Courses:</span>
              <span className="text-xs font-semibold text-slate-800">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">Credits:</span>
              <span className="text-xs font-semibold text-slate-800">13</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">Feedback Given:</span>
              <span className="text-xs font-semibold text-slate-800">2</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default StudentSidebar;