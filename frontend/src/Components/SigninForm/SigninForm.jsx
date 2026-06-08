import { useState, useCallback } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import GoogleSignInButton from "../GoogleSignInButton/GoogleSignInButton";
import styles from "./SigninForm.module.css"
import clsx from "clsx";

function SigninForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to sign in. Check credentials.");
        }
    };

    const handleGoogleCredential = useCallback(async (credential) => {
        setError("");
        try {
            await googleLogin(credential);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to sign in with Google.");
        }
    }, [googleLogin, navigate]);

    return (
        <div className={styles['signin-page']}>
            <div className={styles['signin-card']}>
                <div className={styles['card-header']}>
                    <div className={styles['card-brand']}>UCRide</div>
                    <div className={styles['card-title']}>Welcome Back</div>
                    <div className={styles['card-subtitle']}>New to UCRide? <Link to="/register">Register</Link></div>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className={styles['error-message']} style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                    <div className={styles.field}>
                        <label htmlFor="email">UCR Email</label>
                        <input type="email" id="email" name="email" placeholder="jdoe012@ucr.edu" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} pattern=".+@ucr\.edu$" title="Please provide a valid @ucr.edu email address." />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className={clsx(styles['button-dark'], styles['submit-btn'])}>Sign In</button>
                </form>

                <div className={styles.divider}><span>or</span></div>

                <div className={styles['google-wrap']}>
                    <GoogleSignInButton onCredential={handleGoogleCredential} onError={() => setError("Google sign-in is unavailable right now.")} />
                </div>
            </div>
        </div>
    )
}

export default SigninForm
