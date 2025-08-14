import React, { useEffect, useRef, useState } from "react";
import logo from "../images/eco-light.png";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import user from "../images/user.png";
import { IoIosLogOut } from "react-icons/io";

function Navbar() {
  const dropDown = useRef(null);
  const [visible, setVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeProfile = (e) => {
    if (dropDown.current && !dropDown.current.contains(e.target)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeProfile);
    return () => document.removeEventListener("click", closeProfile);
  }, []);

  const userProfile = () => {
    setVisible(true);
  };

  const navigate = useNavigate();
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:2024/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div>
      <nav className="fixed z-20 w-full bg-white  backdrop-blur-lg shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <img src={logo} className="h-10 w-10" alt="Logo" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center justify-between flex-1 ml-10">
              <ul className="flex space-x-8">
                <NavLink to="Home" className={({ isActive }) => 
                  `text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive ? 'bg-gray-100' : ''}`
                }>
                  <li>Home</li>
                </NavLink>
                <NavLink to="About" className={({ isActive }) => 
                  `text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive ? 'bg-gray-100' : ''}`
                }>
                  <li>About</li>
                </NavLink>
                <NavLink to="Contact" className={({ isActive }) => 
                  `text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive ? 'bg-gray-100' : ''}`
                }>
                  <li>Contact</li>
                </NavLink>
              </ul>
            </div>

            {/* User Profile */}
            <div className="flex items-center">
              <div ref={dropDown} className="relative">
                <button 
                  onClick={userProfile}
                  className="flex items-center focus:outline-none"
                >
                  <img src={user} className="h-10 w-10" alt="User" />
                </button>

                {visible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <NavLink to="UserProfile">
                        <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          View Profile
                        </div>
                      </NavLink>
                      <div
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={logout}
                      >
                        <div className="flex items-center gap-2">
                          Logout
                          <IoIosLogOut className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="Home" className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100
              ${isActive ? 'bg-gray-100' : ''}`
            }>
              Home
            </NavLink>
            <NavLink to="About" className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100
              ${isActive ? 'bg-gray-100' : ''}`
            }>
              About
            </NavLink>
            <NavLink to="Contact" className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100
              ${isActive ? 'bg-gray-100' : ''}`
            }>
              Contact
            </NavLink>
          </div>
        </div>
      </nav>
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}

export default Navbar;