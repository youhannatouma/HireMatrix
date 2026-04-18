import Logo from '../../components/Logo.jsx';
import styles from './Education.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LEVEL = [
    "No formal education",
    "Primary education",
    "Secondary education (High School)",
    "Technical/Vocational training",
    "Some college (no degree)",
    "Associate degree",
    "Bachelor's degree",
    "Master's degree",
    "Doctorate (PhD)",
    "Professional degree (MD, JD, etc.)",
    "Other (please specify)"
];


export default function Education() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState('');
    const [error, setError] = useState(null);

    const redirectAfterDelay = (path, delaySeconds) => {
        setTimeout(() => {
            navigate(path);
        }, delaySeconds * 1000);
    };

    const backBtn = () => {
        redirectAfterDelay('/position', 1);
    };

    const nextBtn = () => {
        const education = inputValue;
        if (!education) {
            setError("Please select an education level");
            return;
        }
        redirectAfterDelay('/languages', 1);
    };

    const filteredLevels = LEVEL.filter(level =>
        level.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setShowDropdown(true);
    };

    const handleSelectLevel = (level) => {
        setInputValue(level);
        setSelectedEducation(level);
        setShowDropdown(false);
        setError(null);
    };

    return (
        <div className={styles.education}>
            <Logo />
            <div className={styles.educationContent}>
                <div className={styles.educationCard}>
                    {error && <p className={styles.errorMessage}> {error} </p>}
                    <h3 className={styles.title}> What is your highest level of education completed? </h3>
                    <div className={styles.autocompleteContainer}>
                        <input
                            type="text"
                            placeholder="e.g., Bachelor's degree, Master's degree..."
                            id="education"
                            className={styles.input}
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        />
                        {showDropdown && filteredLevels.length > 0 && (
                            <ul className={styles.dropdown}>
                                {filteredLevels.map((level, index) => (
                                    <li
                                        key={index}
                                        className={styles.dropdownItem}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSelectLevel(level);
                                        }}
                                    >
                                        {level}
                                    </li>
                                ))}
                            </ul>
                        )}
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