import React from "react";
import {Link, Outlet} from "react-router-dom";
import "./RegisterForm.css"

function RegisterForm() {
    return (
        <div className="register-page">
            <div className="register-card">
                <div className="card-header">
                <div className="card-brand">UCRide</div>
                <div className="card-title">Create an account</div>
                <div className="card-subtitle">Already a member? <Link to="/signin">Sign In</Link></div>
                </div>

                <form action="/register" method="POST">
                <div className="form-row">
                    <div className="field">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" placeholder="Jane" required autoComplete="given-name" />
                    </div>
                    <div className="field">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" placeholder="Doe" required autoComplete="family-name" />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="email">UCR Email</label>
                    <input type="email" id="email" name="email" placeholder="jdoe012@ucr.edu" required autoComplete="username" />
                </div>

                <div className="field">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required autoComplete="new-password" />
                </div>

                <div>
                    <div className="role-label">I want to:</div>
                    <div className="select-role">
                    <div className="role-option">
                        <input type="radio" id="driver" name="role" value="driver" />
                        <label htmlFor="driver">
                        <span className="role-icon"></span>
                        Offer Rides
                        </label>
                    </div>
                    <div className="role-option">
                        <input type="radio" id="rider" name="role" value="rider" />
                        <label htmlFor="rider">
                        <span className="role-icon"></span>
                        Find Rides
                        </label>
                    </div>
                    </div>
                </div>

                <button type="submit" className="button-dark submit-btn">Create Account</button>
                </form>
            </div>
        </div>
    )
}


export default RegisterForm