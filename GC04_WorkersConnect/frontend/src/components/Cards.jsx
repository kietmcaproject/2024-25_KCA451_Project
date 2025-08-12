import React, { useEffect, useState } from "react";
import { FaUser, FaMapMarkerAlt, FaClock, FaPhone } from "react-icons/fa";
import PhoneModal from "./PhoneModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cards = ({ posts, fetchPosts, loading }) => {
  const [isPhonemodal, setIsPhonemodal] = useState(false);

  const navigate = useNavigate();
  const modalHandler = () => setIsPhonemodal((prev) => !prev);

  if (loading) {
    return <p className="text-white text-xl">Loading posts...</p>;
  }

  const btnToGetUserID = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/users/${id}`);
      const user = res.data.user;

      // Navigate and pass user data as state
      navigate(`/users/${id}`, { state: { user } });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  return (
    <>
      {posts.map((post) => (
        <div
          key={post.post_id}
          className="max-w-lg w-1/3 bg-gray-900 text-white p-4 rounded-xl shadow-lg border border-gray-700 hover:shadow-2xl transition-all duration-300"
        >
          {" "}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
              {post.profile_picture ? (
                <img
                  src={post.profile_picture}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-400 text-2xl mx-auto mt-3" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold">{post.name}</h2>
              <div className="text-gray-400 text-sm flex gap-2">
                <FaClock className="text-yellow-400" />
                <span>{new Date(post.time_posted).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-gray-300 flex justify-between text-sm">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-xs">
              {post.category_post}
            </span>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-red-400" />
              <span>{post.location}</span>
            </div>
          </div>
          <p className="mt-3 text-gray-300 text-sm">{post.description}</p>
          {post.post_image && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img
                src={post.post_image}
                alt="Post"
                className="w-full h-40 object-cover"
              />
            </div>
          )}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                btnToGetUserID(post.id);
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              View Profile
            </button>
            <button
              onClick={modalHandler}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-500 transition"
            >
              <FaPhone /> View Number
            </button>
          </div>
        </div>
      ))}

      {isPhonemodal && <PhoneModal onClose={modalHandler} />}
    </>
  );
};

export default Cards;
