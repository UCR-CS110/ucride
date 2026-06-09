import { useState, useEffect, useCallback } from 'react';
import api from '../../../utils/api';
import styles from './ChatSelector.module.css';
import clsx from 'clsx';
import { Inbox } from 'lucide-react';

function formatTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getInitials(fName, lName) {
    return `${fName?.charAt(0) || ''}${lName?.charAt(0) || ''}`.toUpperCase();
}

function ChatSelector({ activeChat, setActiveChat, socket }) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchChats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/messages/conversation');
            const conversations = response.data.data.map(conv => ({
                id: conv.id,
                rideId: conv.rideId._id,
                otherUserId: conv.otherUser._id,
                initials: getInitials(conv.otherUser.fName, conv.otherUser.lName),
                name: `${conv.otherUser.fName} ${conv.otherUser.lName}`,
                time: formatTime(conv.time),
                lastMessage: conv.lastMessage,
            }));
            
            setChats(conversations);
            setActiveChat(prev => {
                if (conversations.length > 0 && !prev) {
                    return conversations[0];
                }
                return prev;
            });
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        } finally {
            setLoading(false);
        }
    }, [setActiveChat]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            setChats(prevChats => {
                const chatIndex = prevChats.findIndex(c => 
                    c.rideId === message.rideId && 
                    (c.otherUserId === message.senderId || c.otherUserId === message.receiverId)
                );
                
                if (chatIndex > -1) {
                    const updatedChat = {
                        ...prevChats[chatIndex],
                        lastMessage: message.content,
                        time: formatTime(message.createdAt)
                    };
                    const newChats = [...prevChats];
                    newChats.splice(chatIndex, 1);
                    return [updatedChat, ...newChats];
                } else {
                    fetchChats();
                    return prevChats;
                }
            });
        };

        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, fetchChats]);

    const handleChatClick = (chat) => {
        setActiveChat(chat);
    };

    return (
        <div className={styles['container-left']}>
            <h1>Messages</h1>
            <search>
                <input type="search" id="site-search" name="q" placeholder="Search conversations..." />
            </search>
            <div className={styles['directmessage-container']}>
                {loading ? (
                    <div className={styles['loading-text']}>
                        Loading...
                    </div>
                ) : chats.length === 0 ? (
                    <div className={styles['loading-text']}>
                        <Inbox size={40} color="var(--blue-pale)" strokeWidth={1.5} style={{ marginBottom: '0.75rem' }} />
                        <p style={{ margin: 0, fontWeight: 500 }}>No conversations yet</p>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: 'var(--text-light)' }}>
                            Messages will appear here
                        </p>
                    </div>
                ) : (
                    chats.map(chat => (
                        <div 
                            key={chat.id}
                            className={clsx(styles.directmessage, activeChat?.id === chat.id && styles.active)}
                            onClick={() => handleChatClick(chat)}
                        >
                            <div className={styles.avatar}>{chat.initials}</div>
                            <div className={styles.right}>
                                <div className={styles.top}>
                                    <span className={styles['profile-name']}>{chat.name}</span>
                                    <span className={styles['time-of-message']}>{chat.time}</span>
                                </div>
                                <div className={styles.bottom}>{chat.lastMessage}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ChatSelector;
