import styles from './Welcome.module.css';
import Logo from '../../components/Logo.jsx';
import { useNavigate } from 'react-router-dom';


export default function Message() {
    const navigate = useNavigate();

    const redirectAfterDelay = (path, delaySeconds) => {
        setTimeout(() => {
            navigate(path);
        }, delaySeconds * 1000);
    };

    const handleClick = () => {
        redirectAfterDelay('/dashboard', 1);
    };

    return (
        <div className={styles.welcome}>
            <Logo />
            <div className={styles.welcomeContent}>
                <div className={styles.welcomeCard}>
                    <div className={styles.checkmarkContainer}>
                        <div className={styles.checkmark}>✓</div>
                    </div>
                    <h2 className={styles.title}> Welcome to HireMatrix! </h2>
                    <p className={styles.message}> Your profile has been successfully created. We'll start matching you with relevant opportunities right away. </p>
                    <button onClick={handleClick} className={styles.dashboardBtn}> Go to Dashboard </button>
                </div>
            </div>
        </div>
    );
}