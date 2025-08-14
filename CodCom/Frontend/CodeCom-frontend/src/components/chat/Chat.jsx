import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from "socket.io-client";
import axios from "axios";
import chatBack from '../../images/chatBack.jpg'
const SOCKET_URL="http://localhost:2024"
function Chat({community}) {
const [socket,setSocket]=useState(null)
const [messages,setMessages]=useState([])
const [message,setMessage]=useState("")
const [isAtBottom, setIsAtBottom] = useState(true);
const chatContainerRef = useRef(null);

useEffect(()=>{
    const newSocket=io(SOCKET_URL)
    setSocket(newSocket)

    newSocket.emit("joinCommunity",community.code)

    newSocket.on("recieveMessage",(msg)=>{
        setMessages((prev)=>[...prev,msg])
    })
    return ()=>{
        newSocket.disconnect()
    }
},[community])

const { name } = useParams();
  const decodeName = decodeURIComponent(name);
useEffect(()=>{
    const fetchMessage=async()=>{
        try {
            const response=await axios.get(`http://localhost:2024/api/community/getMessages/${decodeName}`,{withCredentials:true})

            setMessages(response.data.community.messages || [])
        } catch (error) {
            console.error("Error fetching messages",error);
            
        }
    }
    fetchMessage()
},[messages])

const sendMessage=async()=>{

if(!message.trim()) return ;
const newMessage={user:community.admin.name,message}
if(socket){

    socket.emit('sendMessage',{communityCode:community.code,...newMessage})
}

try {
    await axios.post(`http://localhost:2024/api/community/sendMessages`,{
        code:community.code,
        user:community.members.name,
        message:newMessage.message
    },{withCredentials:true})
} catch (error) {
    console.error("Failed to send messsage",error);    
}
setMessage("")

}
const checkIfAtBottom = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10); // Margin for accuracy
};

// Attach a scroll listener to detect user movement
useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    chatContainer.addEventListener("scroll", checkIfAtBottom);
    return () => chatContainer.removeEventListener("scroll", checkIfAtBottom);
}, []);

// 🔥 Auto-scroll only if the user is at the bottom
useLayoutEffect(() => {
    if (isAtBottom) {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
}, [messages]);


  return (
    <div>
       <div className="p-4 bg-gray-100 rounded-lg ">
      <div  ref={chatContainerRef}
      className="h-80 overflow-y-auto bg-white p-2 shadow-inner relative bg-cover bg-center"
  style={{
    backgroundImage: `url(${chatBack})`,  // Set background image
    backgroundSize: "cover",             // Ensure it covers the entire area
    backgroundPosition: "center",
             // Center the image
  }}>
      {messages && messages.length > 0 ? (
    messages.map((msg, index) => (
        <div key={index} className=' bg-white px-4 py-2 m-2 w-max min-h-max shadow-md border border-gray-200 shadow-gray-400 rounded-md' >
            <strong className='text-orange-900'>{msg.user.name} </strong>
            <p className='text-gray-800'>{msg.message}</p>
        </div>
    ))
) : (
    <p>No messages yet...</p>
)}
                 

      </div>

      <div className="mt-2 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded-l ring-0 outline-none"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
    </div>
  )
}

export default Chat
