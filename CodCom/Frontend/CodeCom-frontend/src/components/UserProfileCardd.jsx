import React from 'react';

function UserProfileCard(props) {
  const { userEmail, userImage, userName, userNumber, visibleValue } = props;

  return (
    <div className="rounded-xl p-4 sm:p-6 shadow-lg w-full md:w-4/5 bg-white">
      <h1 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
        User Profile
      </h1>

      <div className="mt-4 sm:mt-6 flex flex-col items-center">
        <div className="w-32 h-32 sm:w-44 sm:h-44 relative">
          <img 
            src={userImage} 
            className="border-2 rounded-full w-full h-full object-cover"
          
          />
        </div>

        <div className="w-full px-4 sm:px-8 md:px-12 mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="text-gray-600">{userName}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-600 break-all">{userEmail}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-semibold text-gray-700">Phone:</span>
            <span className="text-gray-600">{userNumber}</span>
          </div>
        </div>

        <button
          onClick={visibleValue}
          className="flex mt-6 sm:mt-8 overflow-hidden ring-[5px] ring-white w-[5.1rem] hover:w-[6.5rem] items-center gap-2 cursor-pointer bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-5 py-2 rounded-full transition-all ease-in-out hover:scale-105 active:scale-100 shadow-lg"
        >
          Edit
          <svg
            className="size-6 mt-0.5"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default UserProfileCard;