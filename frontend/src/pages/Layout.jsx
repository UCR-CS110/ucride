import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar.jsx";

function Layout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export default Layout;