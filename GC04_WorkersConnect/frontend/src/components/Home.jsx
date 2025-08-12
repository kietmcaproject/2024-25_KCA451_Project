import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBarMain from "./TopBarMain";
import Cards from "./Cards";
import Categories from "./Categories";
import axios from "axios";

const Home = ({ setAuth }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/all-posts");
      setPosts(res.data.posts);
      console.log(res.data.posts);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="Main-Home h-screen w-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Sidebar fetchPosts={fetchPosts} />

      <div className="h-screen overflow-y-auto w-full md:w-4/5 bg-slate-900 border-l border-slate-800 shadow-inner">
        {/* TOP BAR */}
        <TopBarMain setAuth={setAuth} refreshPosts={fetchPosts} />

        <div className="px-4 py-4">
          <Categories />

          {/* Main Container */}
          <div className="main-content w-full flex flex-wrap mt-6 gap-12 items-start justify-center bg-slate-800/50 p-6 rounded-xl shadow-lg shadow-blue-900/10">
            <Cards
              posts={posts}
              setPosts={setPosts}
              loading={loading}
              refreshPosts={fetchPosts}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

