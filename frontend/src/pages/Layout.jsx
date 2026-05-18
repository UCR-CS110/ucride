import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar.jsx";
import DriverNavbar from "../Components/DriverNavbar/DriverNavbar.jsx";

function Layout() {
    const location = useLocation();

    //Path that don't want to show the main Navbar
    const showNavbar = location.pathname !== '/driver' &&
                       location.pathname !== '/alert' && 
                       location.pathname !== '/profile' && 
                       location.pathname !== '/messages' && 
                       location.pathname !== '/createNewRide' &&
                       location.pathname !== '/requestReview' &&
                       location.pathname !== '/driver/requestReview';

    const showDriverNavbar = location.pathname == '/driver' ||
                       location.pathname == '/alert' ||
                       location.pathname == '/profile' ||
                       location.pathname == '/messages' ||
                       location.pathname == '/createNewRide' ||
                       location.pathname == '/driver/requestReview';
    

    return (
        <>
            {showNavbar && <Navbar />}
            {showDriverNavbar && <DriverNavbar />}
            <Outlet />
        </>
    );
}

export default Layout;