"use client"

import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { error } from "console";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { OngoingCall, Participants, PeerData, SocketUser } from "../../types/page";
import Peer, { SignalData } from 'simple-peer'


interface iSocketContext {
    onlineUsers: SocketUser[] | null
    ongoingCall: OngoingCall | null
    localStream: MediaStream | null
    peer : PeerData | null
    handleCall: (user: SocketUser) => void
    handleAcceptCall: (ongoingCall: OngoingCall) => void
    handleDeclineCall: (data:{ongoingCall?: OngoingCall, isEmitHangup: boolean})=>void

}
export const SocketContext = createContext<iSocketContext | null>(null)

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {

    const { user } = useUser();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>(null);
    const [ongoingCall, setOngoingCall] = useState<OngoingCall | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [peer, setPeer] = useState<PeerData | null>(null);
    const [isCallEnded, setIsCallEnded] = useState(false);

    const currentSocketUser = onlineUsers?.find(onlineUser => onlineUser.userId === user?.id);

    // console.log("IsSocketConnect:>>>", isSocketConnected);
    // console.log("OnlineUsers>>>", onlineUsers);

    //Webrtc implementation..
    const getMediaStream = useCallback(async (faceMode?: string) => {
        if (localStream) return localStream;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput')

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 360, ideal: 720, max: 1080 },
                    frameRate: { min: 16, ideal: 30, max: 30 },
                    facingMode: videoDevices.length > 0 ? faceMode : undefined
                }
            });
            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.log("Failed to load a stream", error);
            setLocalStream(null);
            return null;
        }
    }, [localStream]);

    //Handle Calls 
    const handleCall = useCallback(async (user: SocketUser) => {
        setIsCallEnded(false)
        if (!currentSocketUser || !socket) return;

        const stream = await getMediaStream();
        if (!stream) return;

        const participants = {
            caller: currentSocketUser,
            receiver: user
        }
        setOngoingCall({
            participants,
            isRinging: false
        });
        socket?.emit('call', participants)
    }, [socket, currentSocketUser, ongoingCall]);

    const onIncomingCall = useCallback((participants: Participants) => {
        setIsCallEnded(false)
        setOngoingCall({
            participants,
            isRinging: true
        })
    }, [socket, user, ongoingCall]);

    const handleDeclineCall = useCallback((data : { ongoingCall?: OngoingCall | null, isEmitHangup?: boolean}) => { 
        if(socket && user && data.ongoingCall && data.isEmitHangup){
            socket.emit('hangup',{
                ongoingCall : data.ongoingCall,
                userHangingupId: user.id
            })
        }
        setOngoingCall(null)
        setPeer(null)
        if(localStream){
            localStream.getTracks().forEach((track)=> track.stop())
            setLocalStream(null)
        }
        setIsCallEnded(true)
    }, [socket, user , localStream])

    //This function create the peer the receiver successfully receives the stream
    const createPeer = useCallback((stream: MediaStream, initiator: boolean) => {
        const iceServers: RTCIceServer[] = [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302"
                ]
            }
        ]

        const peer = new Peer({
            stream,
            initiator,
            trickle: true,
            config: { iceServers }
        })

        peer.on('stream', (stream) => {
            setPeer((prevPeer) => {
                if (prevPeer) {
                    return { ...prevPeer, stream }
                }
                return prevPeer;
            })
        });
        peer.on('error', console.error)
        peer.on('close', () => handleDeclineCall({}))

        const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc
        rtcPeerConnection.oniceconnectionstatechange = async () => {
            if (rtcPeerConnection.iceConnectionState === 'disconnected' ||
                rtcPeerConnection.iceConnectionState === 'failed') {
                handleDeclineCall({})
            }
        }
        return peer;
    }, [ongoingCall, setPeer]);

    const completePeerConnection = useCallback(async (connectionData: {
        sdp: SignalData,
        ongoingCall: OngoingCall, isCaller: boolean
    }) => {
        if (!localStream) {
            console.log("Missing the Local Stream!!");
            return;
        }
        if (peer) {
            peer.peerConnection.signal(connectionData.sdp);
            return;
        }

        const newPeer = createPeer(localStream, true)

        setPeer({
            peerConnection: newPeer,
            participantUser: connectionData.ongoingCall.participants.receiver,
            stream: undefined
        });

        newPeer.on('signal', async (data: SignalData) => {
            if (socket) {
                //This emit Offer to server
                socket.emit('webrtcSignal', {
                    sdp: data,
                    ongoingCall,
                    isCaller: true
                })
            }
        })
    }, [localStream, createPeer, peer, ongoingCall])

    const handleAcceptCall = useCallback(async (ongoingCall: OngoingCall) => {
        //This joins the call to the user
        // console.log(ongoingCall);
        setOngoingCall((prev) => {
            if (prev) {
                return { ...prev, isRinging: false }
            }
            return prev;
        });
        const receiverStream = await getMediaStream();
        if (!receiverStream) {
            console.log("Could not get Stream!!");
            handleDeclineCall({
                ongoingCall: ongoingCall ? ongoingCall : undefined,
                isEmitHangup: true,
            })
            return;
        }

        const newPeer = createPeer(receiverStream, true)

        setPeer({
            peerConnection: newPeer,
            participantUser: ongoingCall.participants.caller,
            stream: undefined
        });

        newPeer.on('signal', async (data: SignalData) => {
            if (socket) {
                //This emit Offer to server
                socket.emit('webrtcSignal', {
                    sdp: data,
                    ongoingCall,
                    isCaller: false
                })
            }
        })
    }, [socket, currentSocketUser])


    //Initializing the Socket
    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket);
        return () => {
            newSocket.disconnect()
        }
    }, [user]);

    useEffect(() => {
        if (socket === null) return;
        if (socket.connected) {
            onConnect();
        }
        function onConnect() {
            setIsSocketConnected(true);
        }
        function onDisconnect() {
            setIsSocketConnected(false);
        }
        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)

        return () => {
            socket.off('connect', onConnect)
            socket.off('disconnect', onDisconnect)
        }
    }, [socket])

    //Set Online Users
    useEffect(() => {
        if (!socket || !isSocketConnected) return;

        socket.emit('addNewUser', user);
        socket.on('getUsers', (res) => {
            setOnlineUsers(res)
        })

        return () => {
            socket.off('getUsers', (res) => {
                setOnlineUsers(res)
            })
        }
    }, [socket, isSocketConnected, user])

    //listen to the call event..
    useEffect(() => {
        if (!socket || !isSocketConnected) return;

        socket.on('incomingCall', onIncomingCall)
        socket.on('webrtcSignal', completePeerConnection)
        socket.on('hangup', handleDeclineCall)
        return () => {
            socket.off('incomingCall', onIncomingCall)
            socket.off('webrtcSignal', completePeerConnection)
        }
    }, [socket, isSocketConnected, user, onIncomingCall, completePeerConnection])

    return <SocketContext.Provider value={{ onlineUsers, handleCall, ongoingCall, localStream, handleAcceptCall, peer ,handleDeclineCall}}>
        {children}
    </SocketContext.Provider>
}

export const useSocket = () => {
    const context = useContext(SocketContext);

    if (context === null) {
        throw new Error("useSocket must be used inside within the socketContextProvider")
    }
    return context
}


