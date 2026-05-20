import React, { useState } from "react";
import ChatContent from "../../Components/Chat/ChatContent/ChatContent";
import ChatSelector from "../../Components/Chat/ChatSelector/ChatSelector";
import './Messages.css';

function Messages() {
    const [activeChat, setActiveChat] = useState(null);

    return (
        <div className="messages-page">
            <ChatSelector activeChat={activeChat} setActiveChat={setActiveChat} />
            <ChatContent activeChat={activeChat} />
        </div>
    );
}

export default Messages;
