import React, { useEffect, useState } from 'react';
import { IoSearchOutline, IoClose } from "react-icons/io5";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';

const SearchUser = ({ onClose }) => {
    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const handleSearchUser = async () => {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
        try {
            setLoading(true);
            const response = await axios.post(URL, {
                search: search // Send the search term to the backend (email or name)
            });
            setLoading(false);
            setSearchUser(response.data.data); // Set the users returned by backend
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message || 'An error occurred');
        }
    };

    useEffect(() => {
        if (search.trim()) { // Only trigger search if the search term is not empty
            handleSearchUser();
        } else {
            setSearchUser([]); // Clear search results when the input is empty
        }
    }, [search]); // Trigger search when `search` value changes

    // Inline Styles for Animations
    const backgroundFadeAnimation = {
        animation: "backgroundFade 5s ease-in-out infinite alternate"
    };

    const buttonHoverAnimation = {
        backgroundSize: "200% auto",
        transition: "all 0.5s ease",
    };

    const inputFocusAnimation = {
        animation: "inputFocus 0.3s ease-in-out"
    };

    const avatarPulseAnimation = {
        animation: "avatarPulse 2s infinite ease-in-out"
    };

    const inputFocusKeyframes = `
        @keyframes inputFocus {
            0% {
                border-color: #ccc;
            }
            100% {
                border-color: #4f46e5; /* Blue border */
                box-shadow: 0 0 5px rgba(79, 70, 229, 0.5); /* Blue glow */
            }
        }
    `;

    const backgroundFadeKeyframes = `
        @keyframes backgroundFade {
            0% {
                background-color: rgba(0, 0, 0, 0.4); /* Dark background */
            }
            100% {
                background-color: rgba(0, 0, 0, 0.6); /* Lighter background */
            }
        }
    `;

    const avatarPulseKeyframes = `
        @keyframes avatarPulse {
            0% {
                transform: scale(1);
                opacity: 0.8;
            }
            50% {
                transform: scale(1.1);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0.8;
            }
        }
    `;

    return (
        <div
            className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10"
            style={backgroundFadeAnimation}
        >
            <div className="w-full max-w-lg mx-auto mt-10">
                {/* Input search by email or name */}
                <div className="bg-white rounded h-14 overflow-hidden flex shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <input 
                        type="text"
                        placeholder="Search user by email or name"
                        className="w-full outline-none py-1 h-full px-4 transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        style={inputFocusAnimation}
                    />
                    <div
                        className="h-14 w-14 flex justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-110 rounded-r-md transition-all"
                        style={buttonHoverAnimation}
                    >
                        <IoSearchOutline size={25} className="text-white" />
                    </div>
                </div>

                {/* Display search results */}
                <div className="bg-white mt-2 w-full p-4 rounded">
                    {/* No user found */}
                    {searchUser.length === 0 && !loading && search && (
                        <p className="text-center text-slate-500">No user found!</p>
                    )}

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex justify-center"><Loading /></div>
                    )}

                    {/* Display users found */}
                    {searchUser.length !== 0 && !loading && (
                        searchUser.map((user) => (
                            <UserSearchCard key={user._id} user={user} onClose={onClose} />
                        ))
                    )}
                </div>
            </div>

            {/* Close button */}
            <div
                className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white hover:scale-125 transition-all duration-300"
                onClick={onClose}
                style={avatarPulseAnimation}
            >
                <button>
                    <IoClose />
                </button>
            </div>

            {/* Inline Keyframes */}
            <style>{`
                ${inputFocusKeyframes}
                ${backgroundFadeKeyframes}
                ${avatarPulseKeyframes}
            `}</style>
        </div>
    );
};

export default SearchUser;
