import Logo from '../../components/Logo.jsx';
import styles from './Languages.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LANGUAGES = [
    "English",
    "Arabic",
    "French",
    "Spanish",
    "German",
    "Chinese (Mandarin)",
    "Hindi",
    "Portuguese",
    "Russian",
    "Japanese",
    "Korean",
    "Italian",
    "Turkish",
    "Dutch",
    "Swedish",
    "Greek",
    "Hebrew",
    "Persian (Farsi)",
    "Urdu",
    "Other (please specify)"
];

const PROFICIENCY_LEVELS = [
    "Beginner",
    "Elementary",
    "Intermediate",
    "Upper Intermediate",
    "Advanced",
    "Fluent",
];

export default function Languages() {
    const navigate = useNavigate();
    const [languages, setLanguages] = useState([{ language: '', proficiency: '' }]);
    const [error, setError] = useState(null);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState([false]);

    const redirectAfterDelay = (path, delaySeconds) => {
        setTimeout(() => {
            navigate(path);
        }, delaySeconds * 1000);
    };

    const backBtn = () => {
        redirectAfterDelay('/education', 1);
    };

    const nextBtn = () => {
        const hasEmptyFields = languages.some(lang => !lang.language || !lang.proficiency);
        if (hasEmptyFields) {
            setError("Please fill in all language and proficiency fields");
            return;
        }
        redirectAfterDelay('/location', 1);
    };

    const addLanguage = () => {
        setLanguages([...languages, { language: '', proficiency: '' }]);
        setShowLanguageDropdown([...showLanguageDropdown, false]);
        setError(null);
    };

    const removeLanguage = (index) => {
        if (languages.length > 1) {
            setLanguages(languages.filter((_, i) => i !== index));
            setShowLanguageDropdown(showLanguageDropdown.filter((_, i) => i !== index));
            setError(null);
        }
    };

    const updateLanguage = (index, field, value) => {
        const updatedLanguages = [...languages];
        updatedLanguages[index][field] = value;
        setLanguages(updatedLanguages);
        if (field === 'language') {
            const newShowDropdown = [...showLanguageDropdown];
            newShowDropdown[index] = true;
            setShowLanguageDropdown(newShowDropdown);
        }
    };

    const selectLanguage = (index, language) => {
        updateLanguage(index, 'language', language);
        const newShowDropdown = [...showLanguageDropdown];
        newShowDropdown[index] = false;
        setShowLanguageDropdown(newShowDropdown);
    };

    const getFilteredLanguages = (index) => {
        return LANGUAGES.filter(lang =>
            lang.toLowerCase().includes(languages[index].language.toLowerCase())
        );
    };

    return (
        <div className={styles.languages}>
            <Logo />
            <div className={styles.languagesContent}>
                <div className={styles.languagesCard}>
                    {error && <p className={styles.errorMessage}> {error} </p>}
                    <h3 className={styles.title}> List languages you speak and your proficiency level in each. </h3>

                    <div className={styles.languagesContainer}>
                        {languages.map((lang, index) => (
                            <div key={index} className={styles.languageRow}>
                                <div className={styles.languageInputWrapper}>
                                    <input
                                        type="text"
                                        placeholder="e.g., English, Spanish..."
                                        className={styles.input}
                                        value={lang.language}
                                        onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                                        onFocus={() => {
                                            const newShowDropdown = [...showLanguageDropdown];
                                            newShowDropdown[index] = true;
                                            setShowLanguageDropdown(newShowDropdown);
                                        }}
                                        onBlur={() => setTimeout(() => {
                                            const newShowDropdown = [...showLanguageDropdown];
                                            newShowDropdown[index] = false;
                                            setShowLanguageDropdown(newShowDropdown);
                                        }, 150)}
                                    />
                                    {showLanguageDropdown[index] && getFilteredLanguages(index).length > 0 && (
                                        <ul className={styles.dropdown}>
                                            {getFilteredLanguages(index).map((language, langIndex) => (
                                                <li
                                                    key={langIndex}
                                                    className={styles.dropdownItem}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        selectLanguage(index, language);
                                                    }}
                                                >
                                                    {language}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <select
                                    className={styles.proficiencySelect}
                                    value={lang.proficiency}
                                    onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                                >
                                    <option value="">Select level</option>
                                    {PROFICIENCY_LEVELS.map((level, levelIndex) => (
                                        <option key={levelIndex} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>

                                {languages.length > 1 && (
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeLanguage(index)}
                                        title="Remove language"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button onClick={addLanguage} className={styles.addBtn}>
                        + Add another language
                    </button>

                    <div className={styles.buttonContainer}>
                        <button onClick={backBtn} className={styles.backBtn}> Back </button>
                        <button onClick={nextBtn} className={styles.nextBtn}> Next </button>
                    </div>
                </div>
            </div>
        </div>
    );
}