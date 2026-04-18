import Logo from '../../components/Logo.jsx';
import styles from './Experience.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// To be implemented: send the experience to backend (c#)

const YEARS = [
    "No experience",
    "Less than 1 year",
    "1-2 years",
    "3-5 years",
    "6-10 years",
    "11-15 years",
    "16-20 years",
    "20+ years"
];

export default function Experience() {
    const navigate = useNavigate();
    const [selectedExperience, setSelectedExperience] = useState('');
    const [error, setError] = useState(null);

    const redirectAfterDelay = (path, delaySeconds) => {
        setTimeout(() => {
            navigate(path);
        }, delaySeconds * 1000);
    };

    const backBtn = () => {
        redirectAfterDelay('/industry', 1);
    };

    const nextBtn = () => {
        const experience = setSelectedExperience
        if (!experience) {
            setError("Please select your experience level");
            return;
        }
        redirectAfterDelay('/position', 1);
    };

    const handleExperienceChange = (value) => {
        setSelectedExperience(value);
        setError(null);
    };

    return (
        <div className={styles.experience}>
            <Logo />
            <div className={styles.experienceContent}>
                <div className={styles.experienceCard}>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <h3 className={styles.title}> How many years of experience do you have? </h3>
                    <div className={styles.optionsList}>
                        {YEARS.map((year, index) => (
                            <label key={index} className={styles.option}>
                                <input
                                    type="radio"
                                    name="experience"
                                    value={year}
                                    checked={selectedExperience === year}
                                    onChange={() => handleExperienceChange(year)}
                                    className={styles.radioInput}
                                />
                                <span className={styles.optionLabel}>{year}</span>
                            </label>
                        ))}
                    </div>
                    <div className={styles.buttonContainer}>
                        <button onClick={backBtn} className={styles.backBtn}> Back </button>
                        <button onClick={nextBtn} className={styles.nextBtn}> Next </button>
                    </div>
                </div>
            </div>
        </div>
    )
}