import React from "react";
import {Link, useNavigate} from "react-router-dom";
import "./Navbar.css"
import { useAuth } from "../../context/useAuth.jsx";

function Navbar(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav>
            <div className="left">
                <Link to="/">
                    UCRide
                </Link>
                {user && (
                    <div className="nav-links">
                        {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                        {user.role === 'driver' && <Link to="/driver">Driver</Link>}
                        {user.role === 'rider' && <Link to="/rider">Rider</Link>}
                        <Link to="/messages">Messages</Link>
                    </div>
                )}
            </div>
            <div className="right">
                {user ? (
                    <>
                        <div className="user-info">
                            <span className="user-fname">{user.name}</span>
                            <span className={`role-badge role-${user.role}`}>{user.role}</span>
                        </div>
                        <button className="button-dark" onClick={handleLogout}>
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar