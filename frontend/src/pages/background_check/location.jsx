import Logo from '../../components/Logo.jsx';
import styles from './Location.module.css';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Location() {
    const navigate = useNavigate();
    const locationRef = useRef(null);
    const [error, setError] = useState(null);

    const redirectAfterDelay = (path, delaySeconds) => {
        setTimeout(() => {
            navigate(path);
        }, delaySeconds * 1000);
    };

    const backBtn = () => {
        redirectAfterDelay('/languages', 1);
    };

    const nextBtn = () => {
        const location = locationRef.current.value;
        if (!location) {
            setError('Please enter your city and state');
            return;
        }
        setError(null);
        redirectAfterDelay('/preferences', 1);
    };

    return (
        <div className={styles.location}>
            <Logo />
            <div className={styles.locationContent}>
                <div className={styles.locationCard}>
                    {error && <p className={styles.errorMessage}> {error} </p>}
                    <h3 className={styles.title}> Enter your current city and state. </h3>
                    <input
                        type="text"
                        placeholder="San Francisco, CA"
                        ref={locationRef}
                        className={styles.input}
                        onKeyPress={(e) => e.key === 'Enter' && nextBtn()}
                    />
                    <div className={styles.buttonContainer}>
                        <button onClick={backBtn} className={styles.backBtn}> Back </button>
                        <button onClick={nextBtn} className={styles.nextBtn}> Next </button>
                    </div>
                </div>
            </div>
        </div>
    );
}