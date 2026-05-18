import React from "react";
import {Link} from "react-router-dom";
import "./DriverNavbar.css"

function DriverNavbar(){
    return (
        <nav className="driverNav">
            <div className="driverNavLeft">
                UCRide
                <span className="driver">Driver</span>
            </div>
           
            <div className="driverNavRight">
                <div className="tooltip-container">
                    <Link to="/alert">
                        <button>
                            <img className="driverNavbarImg" src="/icons/bell.png" alt="alert image"/>
                        </button>

                        <span className="tooltip-text">Alert</span>
                    </Link>
                </div>
                
                <div className="tooltip-container">
                    <Link to="/messages">
                        <button>
                            <img className="driverNavbarImg" src="/icons/message.png" alt="message image"/>
                        </button>
                        <span className="tooltip-text">Messages</span>
                    </Link>
                </div>

                <div className="tooltip-container">
                    <Link to="/profile">
                        <button>
                            <img className="driverNavbarImg" src="/icons/profile.png" alt="profile image"/>
                        </button>
                        <span className="tooltip-text">Profile</span>
                    </Link>
                </div>

                <div className="tooltip-container">
                    <Link to="/driver">
                        <button>
                            <img className="driverNavbarImg" src="/icons/back.png" alt="back image"/>
                        </button>

                        <span className="tooltip-text">Go Back</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default DriverNavbar