import Logo from '../../components/Logo.jsx';
import styles from './Position.module.css';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

export default function Position() {
    const navigate = useNavigate();
    const positionRef = useRef(null);

    const redirectAfterDelay = (path, delaySeconds) => {
        setTimeout(() => {
            navigate(path);
        }, delaySeconds * 1000);
    };

    const backBtn = () => {
        redirectAfterDelay('/experience', 1);
    };

    const nextBtn = () => {
        // position can be empty
        const position = positionRef.current.value;
        redirectAfterDelay('/education', 1);
    };

    return (
        <div className={styles.position}>
            <Logo />
            <div className={styles.positionContent}>
                <div className={styles.positionCard}>
                    <h3 className={styles.title}> What is your current position? </h3>
                    <input type="text" placeholder="Senior Software Engineer, ..." ref={positionRef} className={styles.input} />
                    <div className={styles.buttonContainer}>
                        <button onClick={backBtn} className={styles.backBtn}> Back </button>
                        <button onClick={nextBtn} className={styles.nextBtn}> Next </button>
                    </div>
                </div>
            </div>
        </div>
    )
}