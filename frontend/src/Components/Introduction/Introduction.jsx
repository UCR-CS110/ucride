import React from "react";
import {Link, Outlet} from "react-router-dom";
import { Car, DollarSign, Users, Leaf } from 'lucide-react';
import "./Introduction.css"

function Introduction() {
    return (
        <div className="landing">
            <div id="mainContent"className="hero-wrapper">
                <div className="title">Share rides,<br/><span>save money</span></div>
                <div className="subtitle">Get paid to commute, cut costs as a rider</div>
                <Link to="/register" className="button-dark">Get Started</Link>
            </div>
            <div id="whyUCRide">
                <h2>Why UCRide?</h2>
                <div className="why-wrapper">
                    <div className="benefit">
                        <div className="icon-wrapper"><Car /></div>
                        <div className="benefit-content">Easy Parking</div>
                    </div>
                    <div className="benefit">
                        <div className="icon-wrapper"><DollarSign /></div>
                        <div className="benefit-content">Save Money</div>
                    </div>
                    <div className="benefit">
                        <div className="icon-wrapper"><Users /></div>
                        <div className="benefit-content">Build Community</div>
                    </div>
                    <div className="benefit">
                        <div className="icon-wrapper"><Leaf /></div>
                        <div className="benefit-content">Eco-Friendly</div>
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            <div className="how-wrapper">
                <h2>How It Works</h2>
                <div className="how-cols">
                    <div className="how-col">
                        <div className="how-col-title">For Drivers</div>
                        <div className="step"><div className="step-num">1</div><div className="step-text">Post your ride with your schedule and seats</div></div>
                        <div className="step"><div className="step-num">2</div><div className="step-text">Review passenger requests from your campus</div></div>
                        <div className="step"><div className="step-num">3</div><div className="step-text">Complete the ride and earn</div></div>
                    </div>
                    <div className="how-col">
                        <div className="how-col-title">For Passengers</div>
                        <div className="step"><div className="step-num">1</div><div className="step-text">Search for a ride that fits your route</div></div>
                        <div className="step"><div className="step-num">2</div><div className="step-text">Send a ride request to the driver</div></div>
                        <div className="step"><div className="step-num">3</div><div className="step-text">Message your driver and ride together</div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Introduction
