import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import Frame from "./Frame";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const joinCommunity = async () => {
    if (!input) {
      return toast.error("Please fill the field", { autoClose: 1000 });
    }
    try {
      const response = await axios.post(
        "http://localhost:2024/api/community/joinCommunity",
        { code: input },
        { withCredentials: true }
      );

      console.log(response.data);
      toast.success("Community joined successfully", { autoClose: 1000 });
      setInput("");

      setTimeout(() => {
        navigate(`/Community${response.data.community.name}`);
      }, 1000);
    } catch (error) {
      console.log(error, "failed to join community");
      toast.error("Failed to join community", { autoClose: 1000 });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:2024/api/auth/check-Auth", {
          withCredentials: true,
        });
      } catch (error) {
        console.error("User not logged in", error);
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className=" w-full p-4 sm:p-6 md:p-2 relative overflow-hidden">
      <div className="hidden md:block">
        <Frame
          color="bg-red-400"
          size="w-24 md:w-48 h-24 md:h-48"
          top="-5%"
          left="5%"
          delay={0}
        />
        <Frame
          color="bg-green-400"
          size="w-24 md:w-48 h-24 md:h-48"
          top="-5%"
          left="60%"
          delay={2}
        />
        <Frame
          color="bg-green-400"
          size="w-24 md:w-48 h-24 md:h-48"
          top="60%"
          left="5%"
          delay={1}
        />
        <Frame
          color="bg-red-400"
          size="w-24 md:w-48 h-24 md:h-48"
          top="60%"
          left="80%"
          delay={5}
        />
      </div>

      <ToastContainer transition={Slide} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="cursor-default flex flex-col mt-8 md:mt-12 w-full text-center h-full items-center"
      >
        <h1 className="text-5xl mt-6 md:mt-1 sm:text-7xl md:text-9xl font-extrabold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
          CodeCom
        </h1>
      </motion.div>

      <div className="w-full mt-10 md:mt-20 flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 px-4">
        <div className="w-full sm:w-[80%] md:w-[25%]">
          <div className="cursor-default shadow-lg text-center w-full rounded-xl hover:text-black hover:scale-110 duration-700 p-5">
            <h4 className="py-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
              Create Community
            </h4>
            <p className="text-sm sm:text-base leading-7 font-semibold space-y-4">
              Create Your own Community and Teach{" "}
            </p>

            <div className="pb-2 flex justify-center">
              <NavLink to="/Navbar/CommunityForm">
                <button className="w-32 sm:w-36 mt-4 h-10 font-semibold rounded-md shadow-lg border-2 border-gray-400 hover:scale-90 duration-500">
                  Create
                </button>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-[80%] md:w-[25%]">
          <div className="cursor-default shadow-lg text-center w-full rounded-xl hover:text-black hover:scale-110 duration-700 p-5">
            <h4 className="py-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
              Join Community
            </h4>
            <div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="Enter Code"
                className="w-full max-w-[200px] p-2 border-gray-300 border-2 rounded mt-4"
              />
            </div>

            <div className="pb-2 flex justify-center">
              <button
                onClick={joinCommunity}
                className="w-32 sm:w-36 mt-4 h-10 font-semibold rounded-md shadow-lg border-2 border-gray-400 hover:scale-90 duration-500"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;