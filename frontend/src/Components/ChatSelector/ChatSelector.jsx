import React from 'react';
import './ChatSelector.css';

function ChatSelector() {
    return (
        <div className="container-left">
            <h1>Messages</h1>
            <search>
                <input type="search" id="site-search" name="q" placeholder="Search conversations..." />
            </search>
            <div className="directmessage-container">
                <div className="directmessage active">
                    <div className="avatar">SJ</div>
                    <div className="right">
                        <div className="top">
                            <span className="profile-name">Sarah Jade</span>
                            <span className="time-of-message">10:24AM</span>
                        </div>
                        <div className="bottom">Thanks for the ride!</div>
                    </div>
                </div>
                <div className="directmessage">
                    <div className="avatar">MC</div>
                    <div className="right">
                        <div className="top">
                            <span className="profile-name">Mike Chen</span>
                            <span className="time-of-message">6:32PM</span>
                        </div>
                        <div className="bottom">What time are...</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatSelector;
