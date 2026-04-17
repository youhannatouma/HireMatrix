import styles from './Signup.module.css';
import Logo from '../../components/Logo.jsx';

export default function Signup() {
    return (
        <div className={styles.signup}>
            <Logo />
            <div className={styles.signupContent}>
                <div className={styles.signupCard}>
                    <h2>Create your account</h2>
                    <form>
                        <label>
                            Full Name
                            <input type="text" placeholder="Enter your full name" required />
                        </label>

                        <label>
                            Email Address
                            <input type="email" placeholder="Enter your email" required />
                        </label>

                        <label>
                            Password
                            <input type="password" placeholder="Enter your password" required />
                        </label>

                        <label>
                            Confirm Password
                            <input type="password" placeholder="Confirm your password" required />
                        </label>

                        <div className={styles.agreeSection}>
                            <input type="checkbox" />
                            <p>I agree to the <a href="">Terms of Service</a> and <a href="">Privacy Policy</a></p>
                        </div>

                        <button type="submit">Create Account</button>
                    </form>

                    <div className={styles.signinLink}>
                        <p>Already have an account? <a href="/signin">Sign in</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}