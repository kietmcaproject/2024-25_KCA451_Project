"use client";

import { useSocket } from "@/context/SocketContext";
import VideoContainer from "./VideoContainer";
import { useCallback, useEffect, useState } from "react";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdCallEnd } from "react-icons/md";

const VideoCall = () => {
    const { localStream, peer, ongoingCall, handleDeclineCall } = useSocket();
    const [isMicOn, setIsMicOn] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);

    useEffect(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            setIsVideoOn(videoTrack.enabled);
            const audioTrack = localStream.getAudioTracks()[0];
            setIsMicOn(audioTrack.enabled);
        }
    }, [localStream]);

    const toggleCamera = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOn(videoTrack.enabled);
        }
    }, [localStream]);

    const toggleMic = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    }, [localStream]);

    const isOnCall = localStream && peer && ongoingCall ? true : false;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* Video Section */}
            <div className="relative w-full max-w-[800px] aspect-video rounded-lg shadow-lg bg-black">
                {/* Local Stream */}
                {localStream && (
                    <VideoContainer
                        stream={localStream}
                        isLocalStream={true}
                        isOnCall={isOnCall}
                    />
                )}
                {/* Remote Stream */}
                {peer && peer.stream && (
                    <VideoContainer
                        stream={peer.stream}
                        isLocalStream={false}
                        isOnCall={isOnCall}
                    />
                )}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-6 px-6 py-4 bg-white rounded-lg shadow-md mt-6">
                {/* Microphone Toggle */}
                <button
                    onClick={toggleMic}
                    className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition ${
                        isMicOn
                            ? "bg-red-500 text-white hover:bg-red-400"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                    title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                    {isMicOn ? <MdMicOff size={28} /> : <MdMic size={28} />}
                </button>

                {/* End Call Button */}
                <button
                    className="flex items-center justify-center px-6 py-3 bg-red-600 text-white font-bold rounded-full shadow-md hover:bg-red-500 transition"
                    onClick={() => handleDeclineCall({ongoingCall: ongoingCall? ongoingCall: undefined, isEmitHangup: true})}
                    title="End Call"
                >
                    <MdCallEnd size={28} />
                </button>

                {/* Camera Toggle */}
                <button
                    onClick={toggleCamera}
                    className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition ${
                        isVideoOn
                            ? "bg-green-500 text-white hover:bg-green-400"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                    title={isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
                >
                    {isVideoOn ? <MdVideocamOff size={28} /> : <MdVideocam size={28} />}
                </button>
            </div>
        </div>
    );
};

export default VideoCall;

