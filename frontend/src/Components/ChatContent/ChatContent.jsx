import React, { useState, useEffect } from 'react';
import './ChatContent.css';
import sendIcon from '../../../icons/send.png';

function ChatContent({ activeChat }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!activeChat) return;

        // hook up to backend once it is running
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const mockMessages = {
                    1: [
                        { id: 101, sender: 'other', text: "Hi, I'm going to be 5 minutes late to pick you up. Sorry!" },
                        { id: 102, sender: 'me', text: "Okay" },
                        { id: 103, sender: 'other', text: "👍" },
                    ],
                    2: [
                        { id: 201, sender: 'me', text: "Are we still on for today?" },
                        { id: 202, sender: 'other', text: "What time are..." },
                    ],
                    3: [
                        { id: 301, sender: 'other', text: "See you then." },
                    ]
                };

                setTimeout(() => {
                    setMessages(mockMessages[activeChat.id] || []);
                    setLoading(false);
                }, 200);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
                setLoading(false);
            }
        };

        fetchMessages();
    }, [activeChat]);

    if (!activeChat) {
        return (
            <div className="container-right chat-content-announcement">
                <p className="select-chat-message">Select a chat to view messages</p>
            </div>
        );
    }

    return (
        <div className="container-right">
            <div className="banner">
                <div className="avatar">{activeChat.initials}</div>
                <div>
                    <span className="profile-name">{activeChat.name}</span>
                    <span className="activity-status">Active now</span>
                </div>
            </div>
            <div className="messages-container">
                {loading ? (
                    <div className="loading-message">
                        Loading messages...
                    </div>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className={msg.sender === 'me' ? 'sent-message' : 'received-message'}>
                            {msg.text}
                        </div>
                    ))
                )}
            </div>
            <div className="message-input-bar">
                <input type="text" placeholder="Type a message..." />
                <button className="send-btn">
                    <img src={sendIcon} alt="Send" className="icon-xlarge white" />
                </button>
            </div>
        </div>
    );
}

export default ChatContent;
