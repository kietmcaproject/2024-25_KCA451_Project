import React, { useState, useEffect, useRef } from 'react';
import './ChatPanel.css';
import io from 'socket.io-client';
import axios from 'axios';

const ChatPanel = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState({ name: "Anonymous", profilePhoto: "" });
  const [typingUser, setTypingUser] = useState(null);
  const messagesContainerRef = useRef(null);
  const socket = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Connect to the backend server running on http://localhost:5000
    socket.current = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      transports: ["websocket"],
    });

    socket.current.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.current.on('typing', ({ senderName }) => {
      setTypingUser(senderName);

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser(null);
      }, 3000); // Clear typing indicator after 3 seconds
    });

    return () => {
      socket.current.disconnect();
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Fetch user info
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      const fetchUser = async () => {
        try {
          const authToken = localStorage.getItem("authToken");
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getuser/${storedUserId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });

          setUser({
            profilePhoto: response.data.user.profilePic || "defaultProfilePhotoUrl.jpg",
            name: response.data.user.name || "Anonymous",
          });

        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUser();
    }
  }, []);

  // Scroll to bottom of the messages container on new message
  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages]);

  // Handle message sending
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      id: Date.now(),
      sender: user.name,
      text: newMessage,
    };

    socket.current.emit('send_message', message); // Send message to backend
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleTyping = () => {
    socket.current.emit("typing", { senderName: user.name }); // Emit typing event
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender === user.name ? "user" : "receiver"}`}
          >
            <strong>{msg.sender}: </strong><p>{msg.text}</p>
          </div>
        ))}
        {typingUser && (
          <div className="typing-indicator">{typingUser} is typing...</div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type message here..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping(); // Send typing event on input change
          }}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPanel;
