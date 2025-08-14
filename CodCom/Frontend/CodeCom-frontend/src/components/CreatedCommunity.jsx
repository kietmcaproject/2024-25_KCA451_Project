import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFireFlameCurved } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function CreatedCommunity() {
  const [communityList, setCommunityList] = useState([]);
  const navigate = useNavigate();

  const createdCommunityList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2024/api/community/getCreatedCommunity",
        { withCredentials: true }
      );
      setCommunityList(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const enterCommunity = (communityName) => {
    navigate(`/community/${communityName}`);
  };

  useEffect(() => {
    createdCommunityList();
  }, [navigate]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:gap-4">
        {communityList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-gray-500">
            <p className="text-sm">No communities created yet</p>
          </div>
        ) : (
          communityList.map((community) => (
            <div
              key={community._id}
              className="w-full bg-white rounded-lg shadow-sm hover:shadow-lg shadow-zinc-500 transition-shadow duration-200 p-3 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
                    {community.name}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base text-gray-600">
                      <span className="font-medium">Admin:</span>{" "}
                      <span className="text-gray-500">{community.admin.name}</span>
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      <span className="font-medium">Email:</span>{" "}
                      <span className="text-gray-500">{community.admin.email}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => enterCommunity(community.name)}
                  className="group relative px-5 py-1.5 sm:px-6 sm:py-2 bg-rose-400 hover:bg-rose-500 rounded-md text-white text-sm sm:text-base font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  <span className="relative z-10">Enter</span>
                  <div className="absolute inset-0 h-full w-full bg-rose-600 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out" />
                </button>
              </div>

              {community.description && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                    <FaFireFlameCurved className="text-orange-500 flex-shrink-0" />
                    <span className="italic line-clamp-2 text-center">
                      {community.description}
                    </span>
                    <FaFireFlameCurved className="text-red-500 flex-shrink-0" />
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CreatedCommunity;