import React from "react";
import { useState } from "react";
import {Link, useOutletContext} from "react-router-dom";
import "./DriverMyRides.css"

function DriverMyRides(){
    const { reviewCount } = useOutletContext();
    return (
        <>  
            <div className="myRides">
                <div className="left">
                    <h1>My Rides</h1>
                    <h2>Manage Your Ride</h2>
                    <h3>Offerings and Requests</h3>
                </div>
                

                <div className="postRiderButton" className="right">
                    <Link to="/createNewRide">
                        <button className="postRideButton">+ Post New Ride</button>
                    </Link>
                </div>
            </div>

            <div className="reviewRequest">
                <h2 className ="reviewRequestCount">You have <span>{reviewCount}</span> review requests</h2>

                <Link to="/driver/requestReview">
                    <button className="reviewRequestButton">Review Requests</button>
                </Link>

            </div>


            
        </>
    )
}

export default DriverMyRides