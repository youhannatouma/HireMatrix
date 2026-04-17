import styles from './Signin.module.css';
import Logo from '../../components/Logo.jsx';

export default function Signin() {

    return (
        <div className={styles.signin}>
            <Logo />
            <div className={styles.signinContent}>
                <div className={styles.signinCard}>
                    <h2>Welcome back</h2>

                    <form>
                        <label>
                            Email or username
                            <input type="text" placeholder="Enter email or username" required />
                        </label>

                        <label>
                            Password
                            <input type="password" placeholder="Enter your password" required />
                        </label>

                        <div className={styles.rememberSection}>
                            <div className={styles.rememberCheck}>
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </div>
                            <a href="">Forgot password?</a>
                        </div>

                        <button type="submit" className={styles.signinButton}>Sign In</button>
                    </form>

                    <div className={styles.createLink}>
                        <p>Don't have an account? <a href="/signup">Create account</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}