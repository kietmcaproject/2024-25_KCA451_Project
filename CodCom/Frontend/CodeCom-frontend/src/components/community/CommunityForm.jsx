import React, { useState } from "react";
import { motion } from "framer-motion";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CommunityForm() {
    const  navigate  = useNavigate();
  const [input, setInput] = useState({
    name: "",
    code: "",
    description: "",
  });
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!input.name || !input.code || !input.description){
        return toast.error("Please fill all the fields",{autoClose:1000})
    }
    try {

        const response= await axios.post("http://localhost:2024/api/community/createCommunity",input,{withCredentials:true})
        console.log(response.data);
              toast.success("Account created successfully", { autoClose: 1000 });
        
        setInput({
            name: "",
            code: "",
            description: "",
          });
          const communityName=response.data.community.name;
          setTimeout(() => {
            navigate(`/Community/${communityName}`)
          },1000)

    } catch (error) {
        console.log(error,"failed to create community");
        toast.error("Failed to create community",{autoClose:1000})
        
    }
  
   
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
    <ToastContainer transition={Slide}/>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className=" flex justify-center items-center h-screen"
    >
      <form class="bg-white w-[90vw] md:w-[50vw] p-6 rounded-lg shadow-md drop-shadow-lg">
        <div class="mb-4">
          <label for="title" class="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            placeholder="Enter Name"
            onChange={handleInput}
            value={input.name}
            name="name"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label for="title" class="block text-gray-700 text-sm font-bold mb-2">
            Code
          </label>
          <input
            onChange={handleInput}
            value={input.code}
            name="code"
            placeholder="Enter Code"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label
            for="content"
            class="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            onChange={handleInput}
            value={input.description}
            name="description"
            rows="5"
            placeholder="Enter your Description"
            id="content"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div class="flex items-center justify-between">
          <button
            onClick={handleSubmit}
            type="submit"
            class="bg-gradient-to-r from-orange-400 to-purple-400 text-white   font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create
          </button>
        </div>
      </form>
    </motion.div>
    </>
  );
}

export default CommunityForm;
