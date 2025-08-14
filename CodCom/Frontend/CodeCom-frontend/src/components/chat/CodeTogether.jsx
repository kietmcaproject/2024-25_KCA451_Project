// import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { io } from "socket.io-client";
// import axios from "axios";
// import chatBack from '../../images/chatBack.jpg'
// const SOCKET_URL = "http://localhost:2024"

// function CodeTogether({ community }) {

//     // const [socket, setSocket] = useState(null)
//     const [codes, setCodes] = useState("")
//     const chatContainerRef = useRef(null);

//     useEffect(() => {
//         const chatContainerRef = io(SOCKET_URL)
//         // setSocket(chatContainerRef)
//         console.log(chatContainerRef)

//         chatContainerRef.emit("joinCode", community.code)

//         chatContainerRef.on("recieveCode", (code) => {
//             setCodes(codes + code);
//         })
//         return () => {
//             chatContainerRef.disconnect()
//         }
//     }, [community])

//     const { name } = useParams();
//     const decodeName = decodeURIComponent(name);

//     const sendCode = async () => {
        
//         if (!codes.trim()) return;
//         if (chatContainerRef) {
//             chatContainerRef.emit('sendCode', { communityCode: community.code, codes })
//         }
//     }

//     useEffect(()=>{
//         sendCode();
//     },[codes])

//     return (
//         <div>
//             <div className="p-4 bg-gray-100 rounded-lg ">
//                 <div ref={chatContainerRef}
//                     className="h-80 overflow-y-auto bg-white p-2 shadow-inner relative bg-cover bg-center">
//                     <textarea rows="10" cols="200" value={codes} onChange={(e)=>setCodes(e.target.value)}    ></textarea>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CodeTogether



import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
import chatBack from '../../images/chatBack.jpg';

const SOCKET_URL = "http://localhost:2024";

function CodeTogether({ community }) {
    const [codes, setCodes] = useState("");
    const socketRef = useRef(null);
    const textareaRef = useRef(null);
    const { name } = useParams();
    const decodeName = decodeURIComponent(name);

    useEffect(() => {
        // Only connect once
        socketRef.current = io(SOCKET_URL);

        const socket = socketRef.current;
        socket.emit("joinCommunity", community.code);

        socket.on("receiveCode", ({newCode}) => {
            setCodes(newCode);
        });

        return () => {
            socket.disconnect();
        };
    }, [community.code]);

    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        setCodes(newCode);

        if (socketRef.current) {
            socketRef.current.emit('sendCode', { code: community.code, newCode });
        }
    };

    return (
        <div>
            <div className="p-4 bg-gray-100 rounded-lg">
                <div
                    className="h-80 overflow-y-auto bg-white p-2 shadow-inner relative bg-cover bg-center"
                    style={{ backgroundColor: `lightblue` }}
                >
                    <textarea
                        ref={textareaRef}
                        rows="10"
                        cols="100"
                        value={codes}
                        onChange={handleCodeChange}
                        className="w-full h-full resize-none p-2 bg-transparent focus:outline-none"
                    ></textarea>
                </div>
            </div>
        </div>
    );
}

export default CodeTogether;
