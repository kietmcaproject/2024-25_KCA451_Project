import React, { useEffect, useState , useRef} from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
// import socket from './socket';

// Global socket connection (or create in context)
// const socket = io('http://localhost:5000'); // adjust if deployed

export default function ChatPage({ currentUser }) {
    const { userId } = useParams(); // userId you're chatting with
    const socketRef = useRef(null);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        
        if (!currentUser.result._id) return;
        console.log(socketRef.current);
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:5000');
        }
        const curUserId = currentUser.result._id;
        socketRef.current.emit('register', {curUserId});

        const handleReceiveMessage = (message) => {
            setMessages((prev) => [...prev, message]);
          };

        // Handle incoming message
        socketRef.current.on('receiveMessage',handleReceiveMessage );

        return () => {
            socketRef.current.off('receiveMessage',handleReceiveMessage);
            // socketRef.current.disconnect();
        };
    }, [currentUser]);

    const handleSend = () => {
        if (input.trim() === '') return;

        const message = {
            id: Date.now(),
            text: input,
            from: currentUser.result._id,
            to: userId,
        };

        setMessages((prev) => [...prev, message]);
        socketRef.current.emit('sendMessage', { to: userId, message });
        setInput('');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>Chat with {userId}</div>
            <div style={styles.chatBox}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            ...styles.message,
                            alignSelf: msg.from === currentUser.result._id ? "flex-end" : "flex-start",
                            backgroundColor: msg.from === currentUser.result._id ? "#DCF8C6" : "#fff"
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div style={styles.inputContainer}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    style={styles.input}
                />
                <button onClick={handleSend} style={styles.sendButton}>Send</button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '84.4vh',
        width: '100%',
        maxWidth: 600,
        margin: '60px auto',
        border: '1px solid #ccc',
        fontFamily: 'sans-serif'
    },
    header: {
        padding: 16,
        backgroundColor: '#0084FF',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center'
    },
    chatBox: {
        flex: 1,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        overflowY: 'auto',
        backgroundColor: '#f5f5f5'
    },
    message: {
        maxWidth: '60%',
        padding: 10,
        borderRadius: 10,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    inputContainer: {
        display: 'flex',
        padding: 10,
        borderTop: '1px solid #ddd',
        backgroundColor: '#fff'
    },
    input: {
        flex: 1,
        padding: 10,
        borderRadius: 20,
        border: '1px solid #ccc',
        marginRight: 10
    },
    sendButton: {
        padding: '10px 16px',
        border: 'none',
        borderRadius: 20,
        backgroundColor: '#0084FF',
        color: 'white',
        cursor: 'pointer'
    }
};