import React from 'react';
import { Search, LogOut, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBarMain = ({ setAuth }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    setAuth(false);
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <div className="h-16 w-full bg-gradient-to-r from-green-500 via-blue-50 to-slate-500 border-b border-blue-200 px-6 flex items-center justify-between shadow-sm">
      {/* Left Section - Logo */}
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-6 h-6 text-green-600" />
          <span className="text-lg font-semibold text-blue-800">WorkerConnect</span>
        </div>
      </div>

      {/* Middle Section - Search */}
      <div className="flex-1 max-w-2xl mx-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for services..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-blue-200 text-gray-700 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-green-400" />
        </div>
      </div>

      {/* Right Section - Logout */}
      <button
        onClick={logoutHandler}
        className="flex items-center space-x-2 px-4 py-2 text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors duration-200"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default TopBarMain;

