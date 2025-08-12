
import React, { useState, useRef, useEffect } from 'react';

const ChatBot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { text: "Hello! I’m TurboBot 🛒. How can I assist you with your shopping today?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (input.trim() === "") return;
        const userMessage = input.trim();
        setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
        setInput("");

        // eCommerce Bot Response Logic
        setTimeout(() => {
            let botReply = "Sorry, I didn't understand. Can you please rephrase?";
            const lowerCaseMsg = userMessage.toLowerCase();

            if (lowerCaseMsg.includes("order status") || lowerCaseMsg.includes("track my order")) {
                botReply = "You can track your order in the 'My Orders' section or share your Order ID.";
            } else if (lowerCaseMsg.includes("return") || lowerCaseMsg.includes("refund")) {
                botReply = "Our return policy allows returns within 7 days of delivery. Do you want help initiating a return?";
            } else if (lowerCaseMsg.includes("shipping") || lowerCaseMsg.includes("delivery")) {
                botReply = "We offer free shipping on orders above ₹999. Delivery takes 3-5 business days.";
            } else if (lowerCaseMsg.includes("product") || lowerCaseMsg.includes("available")) {
                botReply = "Please share the product name or category. I'll check availability for you.";
            } else if (lowerCaseMsg.includes("payment") || lowerCaseMsg.includes("cod")) {
                botReply = "We accept UPI, Credit/Debit Cards, and Cash on Delivery (COD).";
            } else if (lowerCaseMsg.includes("offer") || lowerCaseMsg.includes("discount")) {
                botReply = "Check out our latest offers in the 'Deals' section! Flat 20% off on new arrivals.";
            } else if (lowerCaseMsg.includes("thank you") || lowerCaseMsg.includes("thanks")) {
                botReply = "You're welcome! 😊 Let me know if you need any more help.";
            }

            setMessages(prev => [...prev, { text: botReply, sender: "bot" }]);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className='fixed bottom-24 right-6 w-full max-w-sm h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col z-50 '>
            {/* Chat Header */}
            <div className='bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center'>
                <h2 className='font-bold'>TurboBot 🚀</h2>
                <button onClick={onClose} className='text-white text-xl'>×</button>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50'>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`p-2 rounded-lg max-w-[70%] ${msg.sender === "user"
                                    ? "bg-blue-500 text-white text-right"
                                    : "bg-gray-300 text-black text-left"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className='p-3 border-t flex'>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className='flex-1 border rounded-l-lg p-2 outline-none'
                    placeholder='Type your message...'
                />
                <button
                    onClick={handleSend}
                    className='bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700'
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
