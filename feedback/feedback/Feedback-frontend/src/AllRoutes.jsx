import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Tags from "./pages/Tags/Tags";
import Users from "./pages/Users/Users";
import Questions from "./pages/Questions/Questions";
import UserProfile from "./pages/UserProfile/UserProfile";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import DisplayQuestion from "./pages/Questions/DisplayQuestion";
import About from "./components/About/About";
import User from "./pages/Users/User";
import Chat from "./components/Chat/Chat";
import ChatPage from "./components/Chat/ChatPage";
import { useSelector } from "react-redux";


const AllRoutes = () => {
  const user = useSelector((state) => state.currentUserReducer);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Tags" element={<Tags />} />
      <Route path="/Auth" element={<Auth />} />
      <Route path="/Users" element={<Users />} />
      <Route path="/Chat" element={<Chat />} />
      <Route path="/ChatPage" element={<ChatPage />} />
      <Route path="/chatPage/:userId" element={<ChatPage currentUser={user} />} />
      <Route path="/Questions" element={<Questions />} />
      <Route path="/Users/:id" element={<UserProfile />} />
      <Route path="/AskQuestion" element={<AskQuestion />} />
      <Route path="/Questions/:id" element={<DisplayQuestion />} />
      <Route path="/About" element={<About/>}/>
      <Route path="/forteam" element={<Users/>}/>
    </Routes>
  );
};

export default AllRoutes;
