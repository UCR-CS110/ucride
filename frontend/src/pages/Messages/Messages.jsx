import React, { useState, useEffect } from "react";
import ChatContent from "../../Components/Chat/ChatContent/ChatContent";
import ChatSelector from "../../Components/Chat/ChatSelector/ChatSelector";
import styles from './Messages.module.css';
import { io } from 'socket.io-client';
import { useAuth } from "../../context/useAuth";
import { useLocation } from "react-router-dom";

function Messages() {
    const { user } = useAuth();
    const location = useLocation();
    const initialRideId = location.state?.rideId;
    const [activeChat, setActiveChat] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (initialRideId) {
            setActiveChat(null);
        }
    }, [initialRideId]);

    useEffect(() => {
        if (!user) return;

        const newSocket = io('http://localhost:5000', {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            upgrade: true,
            rememberUpgrade: true,
            timeout: 10000,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            forceNew: false,
            autoConnect: true
        });

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            newSocket.emit('join', user._id);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            newSocket.close();
        };
    }, [user]);

    useEffect(() => {
        if (!socket || !activeChat?.rideId) return;
        socket.emit('joinRideRoom', activeChat.rideId);
        const rejoin = () => socket.emit('joinRideRoom', activeChat.rideId);
        socket.on('connect', rejoin);
        return () => socket.off('connect', rejoin);
    }, [socket, activeChat]);

    return (
        <div className={styles['messages-page']}>
            <ChatSelector
                activeChat={activeChat}
                setActiveChat={setActiveChat}
                socket={socket}
                initialRideId={initialRideId}
            />
            <ChatContent activeChat={activeChat} socket={socket} />
        </div>
    );
}

export default Messages;
