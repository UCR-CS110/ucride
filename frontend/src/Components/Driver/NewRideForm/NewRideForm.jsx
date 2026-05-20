import React from "react";
import {Link, Outlet} from "react-router-dom";
import "./NewRideForm.css"

function NewRideForm() {
    return (
        <>
            
            <div className="new-ride-page">
                <div className="new-ride-card">
                    <div className="go-back">
                        <Link to="/driver">
                            <button className="back-button">
                                <img src="/icons/back.png"/> 
                                <span>Back</span>
                            </button>
                        </Link>
                    </div>
                    <div className="card-header">
                    <div className="card-title">Post New Ride</div>
                    </div>

                    <form action="/postNewRide" method="POST">
                    <div className="form-row">
                        <div className="field">
                            <label htmlFor="date">Date to Ride</label>
                            <input type="date" id="date" name="date"  required />
                        </div>
                        <div className="field">
                            <label htmlFor="time">Time to Ride</label>
                            <input type="time" id="time" name="time"  required />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="from-where">From</label>
                        <input type="text" id="from-where" name="from-where" placeholder="UC Riverside" required />
                    </div>

                    <div className="field">
                        <label htmlFor="to-where">To</label>
                        <input type="text" id="to-where" name="to-where" placeholder="Irvine" required />
                    </div>

                    <div className="field">
                        <label htmlFor="available-seats">Number of Available Seats</label>
                        <input type="number" id="available-seats" name="available-seats" placeholder="1" required min="1"/>
                    </div>


                    <button type="submit" className="button-dark submit-btn">Post New Ride</button>
                    </form>
                </div>
            </div>
        </>

        
    )
}


export default NewRideForm