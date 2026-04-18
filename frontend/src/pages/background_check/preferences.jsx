import Logo from '../../components/Logo.jsx';
import styles from './Preferences.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const PREFERENCES = [
    "Remote",
    "On-site",
    "Hybrid",
    "No preference"
];

export default function Preferences() {
    const navigate = useNavigate();
    const [selectedPreference, setSelectedPreference] = useState('');
    const [error, setError] = useState(null);

    const redirectAfterDelay = (path, delaySeconds) => {
        setTimeout(() => {
            navigate(path);
        }, delaySeconds * 1000);
    };

    const backBtn = () => {
        redirectAfterDelay('/location', 1);
    };

    const nextBtn = () => {
        const pref = selectedPreference
        if (!pref) {
            setError("Please select a work preference");
            return;
        }
        setError(null);
        redirectAfterDelay('/resume-upload', 1);
    };

    return (
        <div className={styles.preferences}>
            <Logo />
            <div className={styles.preferencesContent}>
                <div className={styles.preferencesCard}>
                    {error && <p className={styles.errorMessage}> {error} </p>}
                    <h3 className={styles.title}> Do you prefer remote, onsite or hybrid work arrangements? </h3>
                    <div className={styles.optionsContainer}>
                        {PREFERENCES.map((preference, index) => (
                            <button
                                key={index}
                                className={`${styles.option} ${selectedPreference === preference ? styles.selected : ''}`}
                                onClick={() => {
                                    setSelectedPreference(preference);
                                    setError(null);
                                }}
                            >
                                <span className={styles.radio}></span>
                                {preference}
                            </button>
                        ))}
                    </div>
                    <div className={styles.buttonContainer}>
                        <button onClick={backBtn} className={styles.backBtn}> Back </button>
                        <button onClick={nextBtn} className={styles.nextBtn}> Next </button>
                    </div>
                </div>
            </div>
        </div>
    );
}