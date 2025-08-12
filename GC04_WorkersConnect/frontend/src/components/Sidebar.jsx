import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, User, MessageSquare, Layers, Info, PlusCircle } from "lucide-react";
import CreatePostModal from "./CreatePostModal";

const Sidebar = ({ fetchPosts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="Sidebar bg-[#1f2937] text-white w-1/5 h-full shadow-2xl md:block hidden">
      {/* User Profile Section */}
      <div className="user-profile p-6 border-b border-[#374151] flex items-center space-x-3 bg-[#111827]">
        <div className="avatar bg-gradient-to-tr from-blue-400 to-blue-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold text-white shadow-md">
          JD
        </div>
        <div className="user-info">
          <h3 className="font-semibold text-blue-100">{user.name}</h3>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="navigation flex-grow p-4">
        <nav>
          <ul className="space-y-3">
            <li>
              <Link
                to="/profile"
                className="flex items-center py-2 px-4 rounded-lg hover:bg-[#374151] transition-all duration-200"
              >
                <User className="mr-3 h-5 w-5 text-blue-300" />
                <span className="text-blue-100">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/testimonials"
                className="flex items-center py-2 px-4 rounded-lg hover:bg-[#374151] transition-all duration-200"
              >
                <MessageSquare className="mr-3 h-5 w-5 text-blue-300" />
                <span className="text-blue-100">Testimonials</span>
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className="flex items-center py-2 px-4 rounded-lg hover:bg-[#374151] transition-all duration-200"
              >
                <Layers className="mr-3 h-5 w-5 text-blue-300" />
                <span className="text-blue-100">Categories</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="flex items-center py-2 px-4 rounded-lg hover:bg-[#374151] transition-all duration-200"
              >
                <Home className="mr-3 h-5 w-5 text-blue-300" />
                <span className="text-blue-100">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="flex items-center py-2 px-4 rounded-lg hover:bg-[#374151] transition-all duration-200"
              >
                <Info className="mr-3 h-5 w-5 text-blue-300" />
                <span className="text-blue-100">About</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Create Post Button */}
      <div className="create-post p-6 border-t border-[#374151] bg-[#111827]">
        <button
          onClick={openModal}
          className="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-300 hover:shadow-xl"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Post
        </button>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        fetchPosts={fetchPosts}
        isOpen={isModalOpen}
        onClose={closeModal}
        userId={user.id}
      />
    </div>
  );
};

export default Sidebar;

