import React from "react";
import {Link, Outlet} from "react-router-dom";
import { Car, DollarSign, Users, Leaf } from 'lucide-react';
import styles from "./Introduction.module.css"

function Introduction() {
    return (
        <div className={styles.landing}>
            <div id="mainContent"className={styles['hero-wrapper']}>
                <div className={styles.title}>Share rides,<br/><span>save money</span></div>
                <div className={styles.subtitle}>Get paid to commute, cut costs as a rider</div>
                <Link to="/register" className={styles['button-dark']}>Get Started</Link>
            </div>
            <div id={styles['whyUCRide']}>
                <h2>Why UCRide?</h2>
                <div className={styles['why-wrapper']}>
                    <div className={styles.benefit}>
                        <div className={styles['icon-wrapper']}><Car /></div>
                        <div className={styles['benefit-content']}>Easy Parking</div>
                    </div>
                    <div className={styles.benefit}>
                        <div className={styles['icon-wrapper']}><DollarSign /></div>
                        <div className={styles['benefit-content']}>Save Money</div>
                    </div>
                    <div className={styles.benefit}>
                        <div className={styles['icon-wrapper']}><Users /></div>
                        <div className={styles['benefit-content']}>Build Community</div>
                    </div>
                    <div className={styles.benefit}>
                        <div className={styles['icon-wrapper']}><Leaf /></div>
                        <div className={styles['benefit-content']}>Eco-Friendly</div>
                    </div>
                </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles['how-wrapper']}>
                <h2>How It Works</h2>
                <div className={styles['how-cols']}>
                    <div className={styles['how-col']}>
                        <div className={styles['how-col-title']}>For Drivers</div>
                        <div className={styles.step}><div className={styles['step-num']}>1</div><div className={styles['step-text']}>Post your ride with your schedule and seats</div></div>
                        <div className={styles.step}><div className={styles['step-num']}>2</div><div className={styles['step-text']}>Review passenger requests from your campus</div></div>
                        <div className={styles.step}><div className={styles['step-num']}>3</div><div className={styles['step-text']}>Complete the ride and earn</div></div>
                    </div>
                    <div className={styles['how-col']}>
                        <div className={styles['how-col-title']}>For Passengers</div>
                        <div className={styles.step}><div className={styles['step-num']}>1</div><div className={styles['step-text']}>Search for a ride that fits your route</div></div>
                        <div className={styles.step}><div className={styles['step-num']}>2</div><div className={styles['step-text']}>Send a ride request to the driver</div></div>
                        <div className={styles.step}><div className={styles['step-num']}>3</div><div className={styles['step-text']}>Message your driver and ride together</div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Introduction
