"use client";

import { useSocket } from "@/context/SocketContext";
import { useUser } from "@clerk/nextjs";
import { FaVideo } from "react-icons/fa";

const ListOfOnlineUsers = () => {
  const { user } = useUser();
  const { onlineUsers, handleCall } = useSocket();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Online Users
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {onlineUsers && onlineUsers.length > 0 ? (
          onlineUsers
            // Exclude the current user
            .filter((onlineUser) => onlineUser.userId !== user?.id)
            .map((onlineUser) => (
              <div
                key={onlineUser.userId}
                className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
              >
                {/* Profile Picture */}
                <img
                  src={onlineUser.profile.imageUrl || "/default-avatar.png"} // Fallback to default image
                  alt={`${onlineUser.profile.fullName}'s profile`}
                  className="w-20 h-20 rounded-full border-2 border-blue-500 mb-4"
                />
                {/* User Name */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {onlineUser.profile.fullName?.split(" ")[0]}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {onlineUser.profile.fullName
                    ?.split(" ")
                    .slice(1)
                    .join(" ")}
                </p>
                {/* Call Button */}
                <button
                  className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                  onClick={() => handleCall(onlineUser)}
                >
                  <FaVideo />
                  <span>Call</span>
                </button>
              </div>
            ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No users online
          </p>
        )}
      </div>
    </div>
  );
};

export default ListOfOnlineUsers;
