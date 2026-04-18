import styles from "./Background.module.css";
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo.jsx';


export default function Background() {
    const navigate = useNavigate();

    const redirectAfterDelay = (path, delaySeconds) => {
        setTimeout(() => {
            navigate(path);
        }, delaySeconds * 1000);
    };

    const backBtn = () => {
        redirectAfterDelay('/', 1);
    }

    const nextBtn = () => {
        redirectAfterDelay('/industry', 1);
    }

    return (
        <div className={styles.background}>
            <Logo />
            <div className={styles.backgroundContent}>
                <div className={styles.backgroundCard}>
                    <h3 className={styles.title}> Background Check </h3>
                    <p className={styles.description}> To help us understand your background better and ensure we can provide you with the best opportunities, we'd like to ask you a few questions. Please answer them accurately so we can find the best opportunities that match your profile. </p>
                    <div className={styles.buttonContainer}>
                        <button onClick={backBtn} className={styles.backBtn}> Back </button>
                        <button onClick={nextBtn} className={styles.nextBtn}> Next </button>
                    </div>
                </div>
            </div>
        </div>
    );
}