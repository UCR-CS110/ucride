import { useState, useEffect, useRef } from 'react';
import styles from './ChatContent.module.css';
import { Send, MessageSquare } from 'lucide-react';
import api from '../../../utils/api';
import { useAuth } from '../../../context/useAuth';
import clsx from 'clsx';

function ChatContent({ activeChat, socket }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        if (!activeChat) return;
        setLoading(true);
        try {
            const response = await api.get('/messages/conversation', {
                params: { rideId: activeChat.rideId }
            });
            setMessages(response.data.data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [activeChat]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            const msgSenderId = message.senderId?._id || message.senderId;
            if (activeChat && message.rideId === activeChat.rideId && msgSenderId?.toString() !== user?._id?.toString()) {
                setMessages(prev => {
                    const exists = prev.find(m => m._id === message._id);
                    if (exists) return prev;
                    return [...prev, message];
                });
            }
        };

        socket.on('newMessage', handleNewMessage);
        return () => socket.off('newMessage', handleNewMessage);
    }, [socket, activeChat, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat || sending) return;

        const messageContent = newMessage.trim();
        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: { _id: user._id, fName: user.fName, lName: user.lName },
            rideId: activeChat.rideId,
            content: messageContent,
            createdAt: new Date().toISOString(),
            pending: true
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage("");
        setSending(true);

        try {
            const response = await api.post('/messages', {
                rideId: activeChat.rideId,
                content: messageContent
            });

            setMessages(prev => prev.map(msg =>
                msg._id === tempId ? response.data.data : msg
            ));
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
            setNewMessage(messageContent);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    if (!activeChat) {
        return (
            <div className={clsx(styles['container-right'], styles['chat-content-announcement'])}>
                <div style={{ textAlign: 'center' }}>
                    <MessageSquare size={48} color="var(--blue-pale)" strokeWidth={1.5} style={{ marginBottom: '1rem' }} />
                    <p className={styles['select-chat-message']}>Select a conversation to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles['container-right']}>
            <div className={styles.banner}>
                <div className={styles.avatar}>{activeChat.initials}</div>
                <div>
                    <span className={styles['profile-name']}>{activeChat.name}</span>
                    <span className={styles['chat-subtitle']}>Group Chat</span>
                </div>
            </div>
            <div className={styles['messages-container']}>
                {loading && messages.length === 0 ? (
                    <div className={styles['loading-message']}>
                        Loading messages...
                    </div>
                ) : messages.length === 0 ? (
                    <div className={styles['loading-message']}>
                        <MessageSquare size={32} color="var(--blue-pale)" strokeWidth={1.5} style={{ marginBottom: '0.5rem' }} />
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map(msg => {
                        const senderId = msg.senderId?._id || msg.senderId;
                        const isMe = senderId === user?._id || senderId?.toString() === user?._id;
                        const senderName = msg.senderId?.fName || '';
                        return (
                            <div
                                key={msg._id}
                                className={isMe ? styles['message-wrapper-sent'] : styles['message-wrapper']}
                            >
                                {!isMe && senderName && (
                                    <span className={styles['sender-label']}>{senderName}</span>
                                )}
                                <div className={isMe ? styles['sent-message'] : styles['received-message']}>
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className={styles['message-input-bar']} onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className={styles['send-btn']} disabled={!newMessage.trim()}>
                    <Send className={clsx(styles['icon-xlarge'], styles.white)} />
                </button>
            </form>
        </div>
    );
}

export default ChatContent;
