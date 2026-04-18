import styles from './Signin.module.css';
import Logo from '../../components/Logo.jsx';
import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { googleProvider, auth } from './firebase_config';
import { signInWithPopup } from 'firebase/auth';

// To be implemented
// log users to database

export default function Signin() {
    const textRef = useRef(null);
    const passRef = useRef(null);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState(null);
    const navigate = useNavigate();

    // Redirect to main pages
    const redirectAfterDelay = (path, delaySeconds) => {
        setTimeout(() => {
            navigate(path);
        }, delaySeconds * 1000);
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        // get inputs
        const text = textRef.current.value;
        const pass = passRef.current.value;
        // validate (check if user account exists in db)
        // for now just redirect
        setMessage('Sign in successful');
        setType('Success');
        redirectAfterDelay('/background', 2);
    };

    const handleGoogleSignin = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                setMessage("Sign in with Google successful");
                setType("Success");
                redirectAfterDelay('/background', 2);
            }).catch((error) => {
                // error messages for failure
                let friendlyError = 'Sign in with Google failed';
                if (error.code === 'auth/popup-closed-by-user') {
                    friendlyError = 'Google sign in popup was closed. Please try again.';
                } else if (error.code === 'auth/popup-blocked') {
                    friendlyError = 'Google sign in popup was blocked. Please allow popups and try again.';
                } else if (error.code === 'auth/cancelled-popup-request') {
                    friendlyError = 'Google sign in was cancelled. Please try again.';
                } else if (error.code === 'auth/network-request-failed') {
                    friendlyError = 'Network error. Please check your connection and try again.';
                }
                setMessage(friendlyError);
                setType("Error");
            });
    };

    return (
        <div className={styles.signin}>
            <Logo />
            <div className={styles.signinContent}>
                <div className={styles.signinCard}>
                    <div className={`${styles.message} ${type === 'Error' ? styles.error : type === 'Success' ? styles.success : ''}`}>
                        {message && <p>{message}</p>}
                    </div>
                    <h2>Welcome back</h2>
                    <form onSubmit={handleSignin}>
                        <label>
                            Email or username
                            <input type="text" placeholder="Enter email or username" required ref={textRef} />
                        </label>

                        <label>
                            Password
                            <input type="password" placeholder="Enter your password" required ref={passRef} />
                        </label>

                        <div className={styles.rememberSection}>
                            {/* forgot pass -> email -> verification -> change pass */}
                            <Link to="/email-verification" state={{ page: "signin"}}>
                                Forgot password?
                            </Link>
                        </div>

                        <button type="button" className={styles.googleButton} onClick={handleGoogleSignin}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </button>

                        <button type="submit" className={styles.signinButton}>Sign In</button>
                    </form>

                    <div className={styles.createLink}>
                        <p>Don't have an account? <a href="/signup">Create account</a></p>
                    </div>
                </div>
            </div >
        </div >
    );
}