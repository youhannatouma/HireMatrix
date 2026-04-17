import styles from './EmailVerification.module.css';
import Logo from '../../components/Logo.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase_config';
import { reload, sendEmailVerification } from 'firebase/auth';

export default function EmailVerification() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('Checking email verification status...');
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastEmailSentTime, setLastEmailSentTime] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const userEmail = auth.currentUser?.email || 'your email';
    const RESEND_COOLDOWN_MINUTES = 15;
    const RESEND_COOLDOWN_MS = RESEND_COOLDOWN_MINUTES * 60 * 1000;

    useEffect(() => {
        checkEmailVerification();
        // Check every 2 seconds if email is verified
        const interval = setInterval(checkEmailVerification, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!lastEmailSentTime) return;

        const timer = setInterval(() => {
            const now = Date.now();
            const timePassed = now - lastEmailSentTime;
            const remaining = Math.max(0, RESEND_COOLDOWN_MS - timePassed);
            setTimeRemaining(remaining);
        }, 1000);

        return () => clearInterval(timer);
    }, [lastEmailSentTime]);

    const checkEmailVerification = async () => {
        try {
            if (!auth.currentUser) {
                setMessage('No user found. Please sign up first.');
                return;
            }

            // Reload user to get latest verification status
            await reload(auth.currentUser);

            if (auth.currentUser.emailVerified) {
                setIsVerified(true);
                setMessage('Email verified successfully!');
                // Redirect to background check after 2 seconds
                setTimeout(() => {
                    navigate('/background');
                }, 2000);
            } else {
                setMessage(`Waiting for email verification. Check your inbox at ${userEmail}`);
            }
        } catch (error) {
            setMessage('Error checking verification status. Please try again.');
            console.error(error);
        }
    };

    const handleResendEmail = async () => {
        try {
            setIsLoading(true);
            if (!auth.currentUser) {
                setMessage('No user found. Please sign up first.');
                return;
            }
            await sendEmailVerification(auth.currentUser);
            setLastEmailSentTime(Date.now());
            setMessage('Verification email sent! Check your inbox.');
        } catch (error) {
            setMessage('Failed to resend email. Please try again later.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTimeRemaining = (ms) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / 1000 / 60) % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.verifyEmail}>
            <Logo />
            <div className={styles.verificationContent}>
                <div className={styles.verificationCard}>
                    <div className={styles.iconContainer}>
                        {isVerified ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className={styles.successIcon}>
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0084ff" strokeWidth="2" className={styles.checkIcon}>
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                            </svg>
                        )}
                    </div>
                    <h2>{isVerified ? 'Email Verified!' : 'Verify Your Email'}</h2>
                    <p className={styles.message}>{message}</p>
                    <p className={styles.instruction}>
                        We've sent a confirmation email to <strong>{userEmail}</strong>.
                        Please click the verification link in the email to confirm your account.
                    </p>
                    {!isVerified && (
                        <button
                            className={styles.checkButton}
                            onClick={handleResendEmail}
                            disabled={isLoading || timeRemaining > 0}
                        >
                            {isLoading ? 'Sending...' : timeRemaining > 0 ? `Resend in ${formatTimeRemaining(timeRemaining)}` : 'Resend Verification Email'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}