import React from 'react';
import './ChatContent.css';
import sendIcon from '../../../icons/send.png';

function ChatContent() {
    return (
        <div className="container-right">
            <div className="banner">
                <div className="avatar">SJ</div>
                <div>
                    <span className="profile-name">Sarah Jade</span>
                    <span className="activity-status">Active now</span>
                </div>
            </div>
            <div className="messages-container">
                <div className="received-message">
                    Hi, I'm going to be 5 minutes late to pick you up. Sorry! 
                </div>
                <div className="sent-message">
                    Okay
                </div>
                <div className="received-message">👍</div>
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
