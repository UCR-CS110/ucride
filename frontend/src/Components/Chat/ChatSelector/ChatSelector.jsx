import React, { useState, useEffect, useCallback } from 'react';
import './ChatSelector.css';

function ChatSelector({ activeChat, setActiveChat }) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    // hook up to backend api once it is running
    const fetchChats = useCallback(async () => {
        setLoading(true);
        try {
            const mockData = [
                {
                    id: 1,
                    initials: 'SJ',
                    name: 'Sarah Jade',
                    time: '10:24AM',
                    lastMessage: 'Thanks for the ride!',
                },
                {
                    id: 2,
                    initials: 'MC',
                    name: 'Mike Chen',
                    time: '6:32PM',
                    lastMessage: 'What time are...',
                },
                {
                    id: 3,
                    initials: 'JD',
                    name: 'John Doe',
                    time: 'Yesterday',
                    lastMessage: 'See you then.',
                }
            ];
            
            setTimeout(() => {
                setChats(mockData);
                setActiveChat(prev => {
                    if (mockData.length > 0 && !prev) {
                        return mockData[0];
                    }
                    return prev;
                });
                setLoading(false);
            }, 200);
        } catch (error) {
            console.error("Failed to fetch chats:", error);
            setLoading(false);
        }
    }, [setActiveChat]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    const handleChatClick = (chat) => {
        setActiveChat(chat);
    };

    return (
        <div className="container-left">
            <h1>Messages</h1>
            <search>
                <input type="search" id="site-search" name="q" placeholder="Search conversations..." />
            </search>
            <div className="directmessage-container">
                {loading ? (
                    <div className="loading-text">
                        Loading...
                    </div>
                ) : (
                    chats.map(chat => (
                        <div 
                            key={chat.id}
                            className={`directmessage ${activeChat?.id === chat.id ? 'active' : ''}`}
                            onClick={() => handleChatClick(chat)}
                        >
                            <div className="avatar">{chat.initials}</div>
                            <div className="right">
                                <div className="top">
                                    <span className="profile-name">{chat.name}</span>
                                    <span className="time-of-message">{chat.time}</span>
                                </div>
                                <div className="bottom">{chat.lastMessage}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ChatSelector;
