import React from "react";
import ChatContent from "../../Components/ChatContent/ChatContent";
import ChatSelector from "../../Components/ChatSelector/ChatSelector";
import './Messages.css';

function Messages() {
    return (
        <div className="messages-page">
            <ChatSelector />
            <ChatContent />
        </div>
    );
}

export default Messages;
