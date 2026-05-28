import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessagesSquare, ChartNoAxesColumn, Car, Tickets } from "lucide-react";
import styles from "./Navbar.module.css";
import { useAuth } from "../../context/useAuth.jsx";
import clsx from "clsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          UCRide
        </Link>
          {user && (
          <div className={styles.navLinks}>
            { user.role === "admin" && (
              <Link to="/admin" className={styles.navLink}><ChartNoAxesColumn /></Link>
            )}
            <Link to="/driver" className={styles.navLink}><Car /></Link>
            <Link to="/rider" className={styles.navLink}><Tickets /></Link> 
            <Link to="/messages" className={styles.navLink}><MessagesSquare /></Link>
          </div>
        )}
      </div>
      <div className={styles.right}>
        {user ? (
          <>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.fName}</span>
            </div>
            <button className={styles.buttonDark} onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin">
              <button className={styles.buttonLight}>Sign in</button>
            </Link>
            <Link to="/register">
              <button className={styles.buttonDark}>Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
