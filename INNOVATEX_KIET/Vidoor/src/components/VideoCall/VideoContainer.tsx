// "use client";

// import { useEffect, useRef } from "react";
// import { cn } from '@/lib/utils'

// interface iVideoContainer {
//     stream: MediaStream | null;
//     isLocalStream: boolean;
//     isOnCall: boolean;
// }

// const VideoContainer = ({ stream, isLocalStream, isOnCall }: iVideoContainer) => {
//     const videoRef = useRef<HTMLVideoElement>(null);

//     useEffect(() => {
//         if (videoRef.current && stream) {
//             videoRef.current.srcObject = stream;
//         }
//     }, [stream]);

//     return (
//         <div className="relative w-full max-w-[800px] mx-auto rounded-xl shadow-lg">
//             {/* Video Element */}
//             <div className="relative overflow-hidden rounded-lg border-4 border-white shadow-md">
//                 {!stream && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
//                         <p className="text-lg animate-pulse">Loading video...</p>
//                     </div>
//                 )}
//                 <video
//                     className= {cn("w-full h-auto rounded-lg", isLocalStream && isOnCall && "w-[200px] h-auto absolute border-orange-500 border-2")}
//                     ref={videoRef}
//                     autoPlay
//                     playsInline
//                     muted={isLocalStream}
//                 />
//             </div>

//             {/* Overlay Controls */}
//             <div className="absolute top-2 right-2 flex items-center space-x-2">
//                 <button
//                     className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 shadow transition"
//                     title={isLocalStream ? "Local Stream" : "Remote Stream"}
//                 >
//                     {isLocalStream ? "You" : "Caller"}
//                 </button>
//                 {isOnCall && (
//                     <button
//                         className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 shadow transition"
//                         title="End Call"
//                     >
//                         End Call
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default VideoContainer;

"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface iVideoContainer {
    stream: MediaStream | null;
    isLocalStream: boolean;
    isOnCall: boolean;
}

const VideoContainer = ({ stream, isLocalStream, isOnCall }: iVideoContainer) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
   //bottom-4 right-4
    return (
        <div
            className={cn(
                "relative w-full max-w-[800px] border-2 border-black aspect-video rounded-lg shadow-lg bg-black overflow-hidden",
                isLocalStream && isOnCall && "absolute m-2 w-[200px] h-[130px] z-10 border-2 border-black"
            )}
        >
            {!stream && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                    <p className="text-white text-lg animate-pulse">Loading video...</p>
                </div>
            )}
            <video
                className="w-full h-full object-cover rounded-lg"
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocalStream}
            />
        </div>
    );
};

export default VideoContainer;

