import React, { useEffect, useRef, useState } from "react";
import Frame from "./Frame";
import { motion } from "framer-motion";
import comImage from "../images/com-image.png";
import SignUpAndLogin from "./SignUpAndLogin";

function Home() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [cursorVariant, setCursorVariant] = useState("default");

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
    },
    text: {
      height: 150,
      width: 150,
      x: mousePosition.x - 75,
      y: mousePosition.y - 75,
      backgroundColor: "purple",
      opacity: 0.3,
      transition:
        "height 0.3s ease-in-out, width 0.3s ease-in-out, background-color 0.3s ease-in-out, opacity 0.3s ease-in-out",
    },
  };

  const textEnter = () => setCursorVariant("text");
  const textLeave = () => setCursorVariant("default");

  const [showSignUp, setShowSignUp] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowSignUp(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef]);

  return (
    <>
      <div className="min-h-screen w-full p-4 sm:p-6 md:p-10 relative overflow-hidden">
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

        <div className="border border-orange-200 w-full min-h-screen md:min-h-[500px]  rounded-xl relative">
          <div className="flex justify-between items-center mt-4 px-4 md:px-10">
            <div>
              <img src={comImage} alt="" className="h-10 w-10 md:h-14 md:w-14" />
            </div>
            <button
              onClick={() => setShowSignUp(true)}
              className="relative group border-none bg-transparent p-0 outline-none cursor-pointer font-mono font-light uppercase text-sm md:text-base"
            >
              <span className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 rounded-lg transform translate-y-0.5 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-[250ms] group-active:translate-y-px"></span>

              <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-l from-[hsl(217,33%,16%)] via-[hsl(217,33%,32%)] to-[hsl(217,33%,16%)]"></span>

              <div className="relative flex items-center justify-between py-2 px-3 md:px-4 text-white rounded-lg transform -translate-y-1 bg-gradient-to-r from-[#f27121] via-[#e94057] to-[#8a2387] gap-2 md:gap-3 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110">
                <span className="select-none whitespace-nowrap">SignUp/Login</span>
              </div>
            </button>
          </div>

          <motion.div
            className="cursor bg-orange-300 rounded-full bg-transparent fixed top-0 left-0 pointer-events-none hidden md:block"
            variants={variants}
            animate={cursorVariant}
            style={{ width: "24px", height: "24px" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="cursor-default flex flex-col mt-20 md:mt-12 w-full text-center h-full items-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-300 to-red-500 bg-clip-text text-transparent">
              Welcome To{" "}
            </h1>
            <h1
              onMouseEnter={textEnter}
              onMouseLeave={textLeave}
              className="text-6xl md:text-9xl font-extrabold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent mt-2"
            >
              CodeCom
            </h1>
            <p className="px-4 md:px-16 text-base md:text-lg text-center mt-4 font-semibold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
              Join a vibrant community of coders, collaborate on projects, and
              level up your skills together. Whether you're a beginner or an
              expert, connect with like-minded learners, share knowledge, and
              grow in a supportive environment. Start coding, learning, and
              building today!
            </p>
          </motion.div>

          {showSignUp && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowSignUp(false);
                }
              }}
            >
              <motion.div
                className="bg-white rounded-xl w-full max-w-md p-6"
                ref={formRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <SignUpAndLogin />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;