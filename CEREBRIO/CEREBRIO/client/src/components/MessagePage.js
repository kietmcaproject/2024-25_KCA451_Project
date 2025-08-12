import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa";
import { IoPaperPlaneOutline, IoClose, IoMic } from "react-icons/io5";
import uploadFile from "../helpers/uploadFile";
import Loading from "./Loading";
import backgroundImage from "../assets/wallapaper.jpeg";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector((state) => state?.user?.socketConnection);
  const user = useSelector((state) => state?.user);
  
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: true,
    _id: "",
  });

  const [message, setMessage] = useState({ text: "", imageUrl: "", videoUrl: "" });
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);
  
  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allMessage]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);
      socketConnection.emit("seen", params.userId);
      
      socketConnection.on("message-user", (data) => setDataUser(data));
      socketConnection.on("message", (data) => setAllMessage((prev) => [...prev, data]));

      return () => {
        socketConnection.off("message-user");
        socketConnection.off("message");
        setAllMessage([]);
      };
    }
  }, [socketConnection, params.userId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      socketConnection.emit("new message", {
        sender: user?._id,
        receiver: params.userId,
        text: message.text,
        imageUrl: message.imageUrl,
        videoUrl: message.videoUrl,
        msgByUserId: user?._id,
      });
      setMessage({ text: "", imageUrl: "", videoUrl: "" });
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => ({ ...prev, text: prev.text + " " + transcript }));
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  const handleVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prev) => ({ ...prev, text: transcript }));
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className="bg-no-repeat bg-cover">
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4 shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/" className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <Avatar width={50} height={50} imageUrl={dataUser?.profile_pic} name={dataUser?.name} userId={dataUser?._id} />
          <div>
            <h3 className="font-semibold text-lg">{dataUser?.name}</h3>
            <p className="text-sm flex items-center">
              <span className={`w-2.5 h-2.5 mr-2 rounded-full ${dataUser.online ? "bg-green-500" : "bg-red-500"}`}></span>
              {dataUser.online ? "online" : "offline"}
            </p>
          </div>
        </div>
        <button className="cursor-pointer hover:text-primary">
          <HiDotsVertical />
        </button>
      </header>

      <section className="h-[calc(100vh-128px)] overflow-y-scroll bg-slate-200 bg-opacity-50">
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div key={index} className={`flex ${user._id === msg?.msgByUserId ? "justify-end" : "justify-start"} items-center gap-2`}>
              {user._id !== msg?.msgByUserId && <Avatar width={40} height={40} imageUrl={dataUser?.profile_pic} name={dataUser?.name} userId={dataUser?._id} />}
              <div className={`p-2 rounded w-fit max-w-md ${user._id === msg?.msgByUserId ? "bg-teal-100" : "bg-white"}`}>                
                {msg?.imageUrl && <img src={msg?.imageUrl} className="w-full h-full object-scale-down" alt="message" />}
                {msg?.videoUrl && <video src={msg.videoUrl} className="w-full h-full object-scale-down" controls />}
                <p className="px-2" style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                <p className="text-xs ml-auto w-fit">{moment(msg.createdAt).format("hh:mm")}</p>
              </div>
              {user._id === msg?.msgByUserId && <Avatar width={40} height={40} imageUrl={user?.profile_pic} name={user?.name} userId={user?._id} />}
            </div>
          ))}
        </div>
      </section>

      <footer className="h-16 bg-white w-full flex justify-between items-center gap-4 p-3 border-t border-slate-300">
        <textarea name="text" rows="2" value={message.text} onChange={(e) => setMessage({ ...message, text: e.target.value })} placeholder="Write a message..." className="w-full resize-y border-2 border-slate-300 p-2 rounded-md outline-none focus:border-primary" />
        <button onClick={handleVoiceSearch} className="bg-gray-300 p-2 rounded-full text-black hover:bg-gray-400">
          <IoMic size={25} />
        </button>
        <button onClick={handleSendMessage} className="bg-primary p-2 rounded-full text-white hover:bg-primary-dark">
          <IoPaperPlaneOutline size={25} />
        </button>
      </footer>
    </div>
  );
};

export default MessagePage;