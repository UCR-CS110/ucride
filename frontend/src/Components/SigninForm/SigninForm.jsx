import React from "react";
import {Link, Outlet} from "react-router-dom";
import "./SigninForm.css"

function SigninForm(){
    return (
        <div className="signin-page">
            <div className="signin-card">
                <div className="card-header">
                    <div className="card-brand">UCRide</div>
                    <div className="card-title">Welcome Back</div>
                    <div className="card-subtitle">New to UCRide? <Link to="/register">Register</Link></div>
                </div>

                <form action="/signin" method="POST">
                    <div className="field">
                        <label htmlFor="email">UCR Email</label>
                        <input type="email" id="email" name="email" placeholder="jdoe012@ucr.edu" required autocomplete="username" />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required autocomplete="current-password" />
                    </div>
                    <button type="submit" className="button-dark submit-btn">Sign In</button>
                </form>
            </div>
        </div>
    )
}

export default SigninForm