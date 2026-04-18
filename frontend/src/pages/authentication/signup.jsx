import styles from './Signup.module.css';
import Logo from '../../components/Logo.jsx';
import { useRef, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from './firebase_config';
import { signInWithPopup, sendEmailVerification } from 'firebase/auth';

// To be implemented:
// log users to database

export default function Signup() {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passRef = useRef(null);
    const confirmPassRef = useRef(null);
    const [isChecked, setChecked] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState(null);
    const navigate = useNavigate();

    const handleCheck = () => {
        setChecked(!isChecked);
    };

    // Validate full name: min 2 chars, letters and spaces only
    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z\s]{2,}$/;
        return nameRegex.test(name);
    };

    // Validate email: standard email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate password: min 8 chars, 1 uppercase, 1 number
    const validatePassword = (password) => {
        const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passRegex.test(password);
    };

    // Redirect to main pages
    const redirectAfterDelay = (path, delaySeconds, stateData) => {
        setTimeout(() => {
            navigate(path, { state: stateData });
        }, delaySeconds * 1000);
    };

    const handleSignup = async (e) => {
        // get fields inputs
        e.preventDefault();
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const pass = passRef.current.value;
        const confirm_pass = confirmPassRef.current.value;
        const checked = isChecked;


        // validate user full name
        if (!validateName(name)) {
            setMessage("Full name must be at least 2 characters and contain only letters and spaces");
            setType("Error");
            return;
        }

        // validate email
        if (!validateEmail(email)) {
            setMessage("Please enter a valid email address");
            setType("Error");
            return;
        }

        // validate password
        if (!validatePassword(pass)) {
            setMessage("Password must be at least 8 characters with 1 uppercase letter and 1 number");
            setType("Error");
            return;
        }

        if (!(pass === confirm_pass)) {
            setMessage("Passwords do not match");
            setType("Error");
            return;
        }

        if (!checked) {
            setMessage("You must agree to the Terms of Service and Privacy Policy before proceeding");
            setType("Error");
            return;
        }

        createUserWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                // Signed up
                //log to database -> we may add it later on
                // redirect to background check
                setMessage("Sign up successful");
                setType("Success");
                // send conf email
                sendEmailVerification(userCredential.user);
                // redirect to email confirmation -> dashboard
                redirectAfterDelay('/email-verification', 2, { page: "signup", email: emailRef.current.value });
            })
            .catch((error) => {
                const errorMessage = error.message;
                let friendlyError = `Sign up failed: ${errorMessage}`;
                if (errorMessage.includes('auth/email-already-in-use')) {
                    friendlyError = 'This email is already registered. Please use a different email or sign in.';
                } else if (errorMessage.includes('auth/weak-password')) {
                    friendlyError = 'Password is too weak. Please use a stronger password.';
                } else if (errorMessage.includes('auth/invalid-email')) {
                    friendlyError = 'Invalid email format. Please check your email.';
                } else if (errorMessage.includes('auth/network-request-failed')) {
                    friendlyError = 'Network error. Please check your connection and try again.';
                } else if (errorMessage.includes('auth/operation-not-allowed')) {
                    friendlyError = 'Email/Password sign up is not enabled. Please contact support.';
                }
                setMessage(friendlyError);
                setType("Error");
            });
    };

    const handleGoogleSignin = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                setMessage("Sign up with Google successful");
                setType("Success");
                redirectAfterDelay('/background', 2);
            }).catch((error) => {
                // error messages for failure
                let friendlyError = 'Sign up with Google failed';
                if (error.code === 'auth/popup-closed-by-user') {
                    friendlyError = 'Google sign-up popup was closed. Please try again.';
                } else if (error.code === 'auth/popup-blocked') {
                    friendlyError = 'Google sign-up popup was blocked. Please allow popups and try again.';
                } else if (error.code === 'auth/cancelled-popup-request') {
                    friendlyError = 'Google sign-up was cancelled. Please try again.';
                } else if (error.code === 'auth/network-request-failed') {
                    friendlyError = 'Network error. Please check your connection and try again.';
                }
                setMessage(friendlyError);
                setType("Error");
            });
    };

    return (
        <div className={styles.signup}>
            <Logo />
            <div className={styles.signupContent}>
                <div className={styles.signupCard}>
                    <div className={`${styles.message} ${type === 'Error' ? styles.error : type === 'Success' ? styles.success : ''}`}>
                        {message && <p>{message}</p>}
                    </div>
                    <h2>Create your account</h2>
                    <form onSubmit={handleSignup}>
                        <label>
                            Full Name
                            <input type="text" placeholder="Enter your full name" required ref={nameRef} />
                        </label>

                        <label>
                            Email Address
                            <input type="email" placeholder="Enter your email" required ref={emailRef} />
                        </label>

                        <label>
                            Password
                            <input
                                type="password"
                                placeholder="Enter your password"
                                required
                                ref={passRef}
                            />
                        </label>

                        <label>
                            Confirm Password
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                required
                                ref={confirmPassRef}
                            />
                        </label>

                        <div className={styles.agreeSection}>
                            <input type="checkbox" checked={isChecked} onChange={handleCheck} />
                            <p>I agree to the <a href="/terms-of-service">Terms of Service</a> and <a href="privacy-policy">Privacy Policy</a></p>
                        </div>

                        <button type="button" className={styles.googleButton} onClick={handleGoogleSignin}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign up with Google
                        </button>

                        <button type="submit">Create Account</button>
                    </form>

                    <div className={styles.signinLink}>
                        <p>Already have an account? <a href="/">Sign in</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}