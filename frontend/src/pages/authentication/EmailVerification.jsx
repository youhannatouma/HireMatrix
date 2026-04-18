import styles from './EmailVerification.module.css';
import Logo from '../../components/Logo.jsx';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from './firebase_config';
import { reload, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';

export default function EmailVerification() {
    const { state } = useLocation();
    const page = state?.page;
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(page === 'signup');
    const [lastEmailSentTime, setLastEmailSentTime] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState('');

    const RESEND_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

    // For signin: redirect to dashboard after user signs in following password reset
    useEffect(() => {
        if (page === 'signin' && auth.currentUser && isSubmitted) {
            navigate('/dashboard');
        }
    }, [page, isSubmitted, navigate]);

    // For signup: check for email verification
    useEffect(() => {
        if (page === 'signup') {
            const userEmail = auth.currentUser?.email;
            setEmail(userEmail);
            checkEmailVerification();
            const interval = setInterval(checkEmailVerification, 2000);
            return () => clearInterval(interval);
        }
    }, [page]);

    // Countdown timer for resend button
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

            await reload(auth.currentUser);

            if (auth.currentUser.emailVerified) {
                setIsVerified(true);
                setMessage('Email verified successfully!');
                setTimeout(() => {
                    navigate('/background');
                }, 2000);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSigninSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const actionCodeSettings = {
                url: `${window.location.origin}/`,
                handleCodeInApp: false,
            };
            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setIsSubmitted(true);
            setLastEmailSentTime(Date.now());
            setMessage('Password reset link sent successfully!');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setMessage('No account found with this email address.');
            } else {
                setMessage('Failed to send reset link. Please try again.');
            }
            console.error('Password reset error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendEmail = async () => {
        setIsLoading(true);
        try {
            if (page === 'signup' && auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
            } else if (page === 'signin') {
                const actionCodeSettings = {
                    url: `${window.location.origin}/`,
                    handleCodeInApp: false,
                };
                await sendPasswordResetEmail(auth, email, actionCodeSettings);
            }
            setLastEmailSentTime(Date.now());
            setMessage(page === 'signup' ? 'Verification email resent!' : 'Password reset link resent!');
        } catch (error) {
            setMessage('Failed to resend. Please try again later.');
            console.error('Resend error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTimeRemaining = (ms) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor(ms / 1000 / 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (page === 'signin') {
        return (
            <div className={styles.emailVerification}>
                <Logo />
                <div className={styles.verificationContent}>
                    <div className={styles.verificationCard}>
                        {!isSubmitted ? (
                            <div>
                                <div className={styles.iconContainer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0084ff" strokeWidth="2" className={styles.icon}>
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </div>
                                <h2>Reset Your Password</h2>
                                <p className={styles.description}>
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>

                                <form onSubmit={handleSigninSubmit} className={styles.form}>
                                    <label>
                                        Email Address
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </label>
                                    <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                                        {isLoading ? 'Sending...' : 'Send Verification Link'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className={styles.sentContainer}>
                                <div className={styles.iconContainer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className={styles.successIcon}>
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                                <h2>Verification Link Sent!</h2>
                                <p className={styles.description}>
                                    We've sent a password reset link to <strong>{email}</strong>.
                                </p>
                                <p className={styles.instruction}>
                                    Check your inbox and click the link to reset your password. The link will expire in 24 hours.
                                </p>

                                <button
                                    onClick={handleResendEmail}
                                    disabled={isLoading || timeRemaining > 0}
                                    className={styles.resendBtn}
                                >
                                    {timeRemaining > 0
                                        ? `Resend in ${formatTimeRemaining(timeRemaining)}`
                                        : 'Resend Verification Link'}
                                </button>

                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className={styles.changeEmailBtn}
                                >
                                    Use Different Email
                                </button>

                                <button
                                    onClick={() => navigate('/')}
                                    className={styles.changeEmailBtn}
                                >
                                    Back to Sign In
                                </button>

                                {message && <p className={styles.message}>{message}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Signup flow
    return (
        <div className={styles.emailVerification}>
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0084ff" strokeWidth="2" className={styles.icon}>
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        )}
                    </div>

                    <h2>{isVerified ? 'Email Verified!' : 'Verify Your Email'}</h2>

                    {!isVerified && (
                        <>
                            <p className={styles.description}>
                                We've sent a verification email to <strong>{email}</strong>.
                            </p>
                            <p className={styles.instruction}>
                                Click the verification link in your email to confirm your account. We're checking for verification automatically.
                            </p>

                            <button
                                onClick={handleResendEmail}
                                disabled={isLoading || timeRemaining > 0}
                                className={styles.resendBtn}
                            >
                                {timeRemaining > 0
                                    ? `Resend in ${formatTimeRemaining(timeRemaining)}`
                                    : 'Resend Verification Email'}
                            </button>

                            {message && <p className={styles.message}>{message}</p>}
                        </>
                    )}

                    {isVerified && (
                        <p className={styles.successMessage}>
                            Your email has been verified. Redirecting to next step...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
//     const email= state?.email;
//     const navigate = useNavigate();
//     const [message, setMessage] = useState('Checking email verification status...');
//     const [isVerified, setIsVerified] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [lastEmailSentTime, setLastEmailSentTime] = useState(null);
//     const [timeRemaining, setTimeRemaining] = useState(0);
//     const userEmail = auth.currentUser?.email || 'your email';
//     const RESEND_COOLDOWN_MINUTES = 15;
//     const RESEND_COOLDOWN_MS = RESEND_COOLDOWN_MINUTES * 60 * 1000;

//     useEffect(() => {
//         checkEmailVerification();
//         // Check every 2 seconds if email is verified
//         const interval = setInterval(checkEmailVerification, 2000);
//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => {
//         if (!lastEmailSentTime) return;

//         const timer = setInterval(() => {
//             const now = Date.now();
//             const timePassed = now - lastEmailSentTime;
//             const remaining = Math.max(0, RESEND_COOLDOWN_MS - timePassed);
//             setTimeRemaining(remaining);
//         }, 1000);

//         return () => clearInterval(timer);
//     }, [lastEmailSentTime]);

//     const checkEmailVerification = async () => {
//         try {
//             if (!auth.currentUser) {
//                 setMessage('No user found. Please sign up first.');
//                 return;
//             }

//             // Reload user to get latest verification status
//             await reload(auth.currentUser);

//             if (auth.currentUser.emailVerified) {
//                 setIsVerified(true);
//                 setMessage('Email verified successfully!');
//                 // Redirect to background check after 2 seconds
//                 setTimeout(() => {
//                     navigate('/background');
//                 }, 2000);
//             } else {
//                 setMessage(`Waiting for email verification. Check your inbox at ${userEmail}`);
//             }
//         } catch (error) {
//             setMessage('Error checking verification status. Please try again.');
//             console.error(error);
//         }
//     };

//     const handleResendEmail = async () => {
//         try {
//             setIsLoading(true);
//             if (!auth.currentUser) {
//                 setMessage('No user found. Please sign up first.');
//                 return;
//             }
//             await sendEmailVerification(auth.currentUser);
//             setLastEmailSentTime(Date.now());
//             setMessage('Verification email sent! Check your inbox.');
//         } catch (error) {
//             setMessage('Failed to resend email. Please try again later.');
//             console.error(error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const formatTimeRemaining = (ms) => {
//         const seconds = Math.floor((ms / 1000) % 60);
//         const minutes = Math.floor((ms / 1000 / 60) % 60);
//         return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//     };

//     return (
//         <div className={styles.verifyEmail}>
//             <Logo />
//             <div className={styles.verificationContent}>
//                 <div className={styles.verificationCard}>
//                     <div className={styles.iconContainer}>
//                         {isVerified ? (
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className={styles.successIcon}>
//                                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//                                 <polyline points="22 4 12 14.01 9 11.01" />
//                             </svg>
//                         ) : (
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0084ff" strokeWidth="2" className={styles.checkIcon}>
//                                 <circle cx="12" cy="12" r="10" />
//                                 <path d="M12 6v6l4 2" />
//                             </svg>
//                         )}
//                     </div>
//                     <h2>{isVerified ? 'Email Verified!' : 'Verify Your Email'}</h2>
//                     <p className={styles.message}>{message}</p>
//                     <p className={styles.instruction}>
//                         We've sent a confirmation email to <strong>{userEmail}</strong>.
//                         Please click the verification link in the email to confirm your account.
//                     </p>
//                     {!isVerified && (
//                         <button
//                             className={styles.checkButton}
//                             onClick={handleResendEmail}
//                             disabled={isLoading || timeRemaining > 0}
//                         >
//                             {isLoading ? 'Sending...' : timeRemaining > 0 ? `Resend in ${formatTimeRemaining(timeRemaining)}` : 'Resend Verification Email'}
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }