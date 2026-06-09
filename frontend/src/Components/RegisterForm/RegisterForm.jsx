import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import styles from "./RegisterForm.module.css"
import clsx from "clsx";

function RegisterForm() {
    const [formData, setFormData] = useState({
        fName: "",
        lName: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await register(formData);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to register. Please check your details.");
        }
    };

    return (
        <div className={styles['register-page']}>
            <div className={styles['register-card']}>
                <div className={styles['card-header']}>
                <div className={styles['card-brand']}>UCRide</div>
                <div className={styles['card-title']}>Create an account</div>
                <div className={styles['card-subtitle']}>Already a member? <Link to="/signin">Sign In</Link></div>
                </div>

                <form onSubmit={handleSubmit}>
                {error && <div className={styles['error-message']}>{error}</div>}
                <div className={styles['form-row']}>
                    <div className={styles.field}>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" name="fName" value={formData.fName} onChange={handleChange} placeholder="Jane" required autoComplete="given-name" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lName" value={formData.lName} onChange={handleChange} placeholder="Doe" required autoComplete="family-name" />
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="email">UCR Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="jdoe012@ucr.edu" required autoComplete="username" pattern=".+@ucr\.edu$" title="Please provide a valid @ucr.edu email address." />
                </div>

                <div className={styles.field}>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
                </div>

                <button type="submit" className={clsx(styles['button-dark'], styles['submit-btn'])}>Create Account</button>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm