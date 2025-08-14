import axios from "axios";
import React, { useState } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserEditCard(props) {
  const { userInputEmail, visibility, onUpdate } = props;
  const [userInputData, setUserInputData] = useState({
    inputName: "",
    inputNumber: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateData = async (e) => {
    e.preventDefault();
    const payload = {};
    if (userInputData.inputName) payload.inputName = userInputData.inputName;
    if (userInputData.inputNumber) payload.inputNumber = userInputData.inputNumber;

    if (Object.keys(payload).length === 0) {
      toast.warn("No changes to update", { autoClose: 1000 });
      setTimeout(() => {
        visibility();
      }, 2000);
      return;
    }

    try {
      const data = await axios.post(
        "http://localhost:2024/api/user/updateUser",
        payload,
        { withCredentials: true }
      );
      
      toast.success("Updated Successfully", { autoClose: 1000 });
      setUserInputData({
        ...(payload.inputName ? { inputName: "" } : {}),
        ...(payload.inputNumber ? { inputNumber: "" } : {}),
      });

      setTimeout(() => {
        visibility();
      }, 2000);
      onUpdate();
    } catch (error) {
      console.log(error, " error updating details");
      toast.error("Failed to update profile", { autoClose: 1000 });
    }
  };

  return (
    <div className="rounded-xl p-4 sm:p-6 shadow-lg w-full md:w-4/5 bg-white">
      <ToastContainer transition={Slide} />
      <h1 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
        Edit Profile
      </h1>

      <div className="flex flex-col gap-6 mt-4 sm:mt-6">
        <div className="w-full flex justify-center">
          <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
            {/* <UserImage className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" /> */}
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full px-2 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="font-medium text-gray-700 min-w-[80px]">Name:</label>
            <input
              type="text"
              value={userInputData.inputName}
              onChange={handleInput}
              name="inputName"
              placeholder="Enter Name"
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="font-medium text-gray-700 min-w-[80px]">Email:</label>
            <input
              type="email"
              placeholder={userInputEmail}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="font-medium text-gray-700 min-w-[80px]">Phone:</label>
            <input
              type="number"
              name="inputNumber"
              value={userInputData.inputNumber}
              onChange={handleInput}
              placeholder="Enter Number"
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <button
            onClick={updateData}
            className="group relative flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-100"
          >
            <span>Update</span>
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:rotate-45"
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
    </div>
  );
}

export default UserEditCard