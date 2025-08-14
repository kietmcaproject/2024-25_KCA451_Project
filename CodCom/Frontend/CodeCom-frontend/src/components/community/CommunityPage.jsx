import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Chat from "../chat/Chat";
import CodeTogether from "../chat/CodeTogether";

function CommunityPage() {
  const [visible, setVisible] = useState("");
  const [infoVisible, setInfoVisible] = useState(false);
  const [membersVisible, setMembersVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { name } = useParams();
  const decodeName = decodeURIComponent(name);

  const [community, setCommunity] = useState(() => {
    const savedCommunity = localStorage.getItem(decodeName);
    return savedCommunity ? JSON.parse(savedCommunity) : { members: [] };
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2024/api/community/${decodeName}`,
        { withCredentials: true }
      );
      setCommunity(response.data.community);
      localStorage.setItem(decodeName, JSON.stringify(response.data.community));
      const { currentUserId } = response.data;

      if (community.admin._id === currentUserId) {
        setIsAdmin(true);
      }
      console.log(response.data.community);
    } catch (error) {
      console.log("community data not found");
    }
  };

  useEffect(() => {
    fetchData();
    console.log(community);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-16 py-4 ">
        <div className="w-full md:w-auto">
          <NavLink to="/Navbar/UserProfile">
            <button
              className="cursor-pointer duration-200 hover:scale-125 active:scale-100"
              title="Go Back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40px"
                height="40px"
                viewBox="0 0 24 24"
                className="stroke-blue-300"
              >
                <path
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  d="M11 6L5 12M5 12L11 18M5 12H19"
                ></path>
              </svg>
            </button>
          </NavLink>
        </div>
        
        <div className="flex flex-col text-center">
          <h1 className="text-3xl h-16 md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent ">
            {community.name}
          </h1>
          <p className="text-zinc-600  mb-2 text-sm md:text-lg">
            {community.description}
          </p>
        </div>

        <div className="relative">
          <section
            onClick={() => setInfoVisible(!infoVisible)}
            className="relative flex cursor-pointer justify-center items-center"
          >
            <div className="group flex justify-center transition-all hover:scale-125  rounded-full bg-gray-200 p-1">
              <svg viewBox="0 0 320 512" className="w-6 h-6">
                <path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path>
              </svg>
              
            </div>
          </section>
          
          {infoVisible && (
            <div className="absolute right-0 z-40 mt-1 w-64 md:w-72">
              <div className="card font-sans bg-white rounded-lg overflow-hidden transform transition duration-500 hover:shadow-2xl">
                <div className="p-4 bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 text-white">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">Social Media</div>
                    <div className="flex items-center space-x-4">
                      <a href="#" target="_blank" className="hover:text-gray-100">
                        <FaLinkedin className="w-6 h-6 scale-200 ease-out transition duration-300 hover:scale-75" />
                      </a>
                      <a href="#" target="_blank" className="hover:text-gray-200">
                        <FaGithub className="w-6 h-6 scale-200 ease-out transition duration-300 hover:scale-75" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-black text-xl font-bold mb-2">
                    {community.name}
                  </div>
                  <div className="text-gray-700 mb-4">
                    <p className="text-sm">Admin: {community.admin.name}</p>
                    <p className="text-sm">Code: {community.code}</p>
                    <p className="text-sm">
                      Strength: {community.members.length}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex justify-between">
                      <button className="inline-block cursor-pointer font-mono text-sm font-bold bg-slate-500 text-white py-2 px-4 rounded-full transition ease-in-out delay-75 duration-100 hover:-translate-y-1 hover:scale-110 transform hover:opacity-75">
                        Edit
                      </button>
                      <button className="inline-flex items-center px-3 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-full hover:-translate-y-1 hover:scale-110">
                        <svg
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          ></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col ">
        <div               onClick={() => setMembersVisible(!membersVisible)}
 className=" cursor-pointer bg-gray-200  shadow-inner shadow-zinc-400  w-full">
          <div className="flex justify-between items-center px-4 py-3 border-b border-white">
            <h1 className="font-bold text-zinc-700">Members</h1>
            <button
              className="text-zinc-600 hover:text-zinc-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-transform duration-200 ${
                  membersVisible ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          
          {membersVisible && (
            <div className="max-h-60 absolute w-full overflow-y-auto">
              {community.members?.map((member) => (
                <div
                  key={member.name}
                  className="px-4 py-2 bg-white hover:bg-gray-200  transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <p className="text-zinc-700 break-words">{member.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white shadow-md mt-4">
          <ul className="flex w-full">
            <li
              onClick={() => setVisible("chat")}
              className="cursor-pointer border border-zinc-300 w-full text-center p-2 hover:bg-gray-50"
            >
              Chat
            </li>
            
            <li
              onClick={() => setVisible("code")}
              className="cursor-pointer border border-zinc-300 w-full text-center p-2 hover:bg-gray-50"
            >
              Code Together
            </li>
          </ul>

          <div className="p-4">
            {visible === "chat" ? (
              <div>

              <Chat community={community}/>

              </div>
            )  : visible === "code" ? (
              <div><CodeTogether community={community}/></div>
            ) : (
              <div className="flex w-full h-[60vh] justify-center items-center">
                <h1 className="text-2xl md:text-5xl text-gray-300 font-bold text-center">
                  What are you going to do Today?
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;