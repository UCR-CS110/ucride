import React from "react";
import {Link, Outlet} from "react-router-dom";
import "./Navbar.css"

function Navbar(){
    return (
        <nav>
            <div className="left">
                <Link to="/">
                    UCRide
                </Link>
            </div>
            <div className="right">
                {/* <span className="user-fname">Drake</span> */}
                <Link to="/signin">
                    <button className="button-light">
                        Sign in
                    </button>
                </Link>
                <Link to="/register">
                    <button className="button-dark">
                        Register
                    </button>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar