import React, { useState } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IoClose } from "react-icons/io5";

function Frame({ color, size, top, left, delay }) {
  return (
    <div
      className={`absolute ${size} ${color} rounded-full blur-3xl opacity-30 animate-pulse`}
      style={{
        top,
        left,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function App() {
  const [inputData, setInputData] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:2024/api/auth/verify-email", {
        code: inputData,
      });
      toast.success("Verification successful", { autoClose: 1000 });
      setInputData("");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error("Invalid Code", { autoClose: 1000 });
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1000} transition={Slide} />
      <div className="min-h-screen w-full p-4 sm:p-6 md:p-10 bg-gradient-to-br from-yellow-100 via-orange-100 to-purple-200 relative overflow-hidden">
        {/* Animated background frames */}
        <Frame
          color="bg-red-400"
          size="w-32 md:w-48 h-32 md:h-48"
          top="-5%"
          left="5%"
          delay={0}
        />
        <Frame
          color="bg-green-400"
          size="w-32 md:w-48 h-32 md:h-48"
          top="-5%"
          left="60%"
          delay={2}
        />
        <Frame
          color="bg-green-400"
          size="w-32 md:w-48 h-32 md:h-48"
          top="60%"
          left="5%"
          delay={1}
        />
        <Frame
          color="bg-red-400"
          size="w-32 md:w-48 h-32 md:h-48"
          top="60%"
          left="80%"
          delay={5}
        />

        <div className="w-full h-full min-h-[80vh] flex justify-center items-center">
          <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-xl shadow-xl backdrop-blur-sm bg-opacity-90">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <h1 className="text-center bg-gradient-to-r from-orange-500 to-purple-700 bg-clip-text text-transparent font-bold text-2xl sm:text-3xl">
                Enter Verification Code
              </h1>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  required
                  name="code"
                  onChange={(e) => setInputData(e.target.value)}
                  value={inputData}
                  placeholder="Enter 6-digit code"
                  className="w-full p-3 text-center text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-xl transition-all"
                />
                <p className="text-sm text-center text-gray-600">
                  Please check your email for the verification code
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={handleVerify}
                  className="relative px-6 py-3 text-white bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg 
                    transform transition-all duration-200
                    hover:scale-105 hover:shadow-lg
                    active:scale-95 active:shadow-inner
                    disabled:opacity-50 disabled:cursor-not-allowed
                    before:absolute before:inset-0 before:bg-white before:opacity-0 before:transition-opacity hover:before:opacity-20"
                  disabled={inputData.length !== 6}
                >
                  Verify Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;