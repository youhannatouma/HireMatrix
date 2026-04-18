
import { useState } from 'react';
import Logo from '../../components/Logo.jsx';
import { useNavigate } from 'react-router-dom';
import styles from './Industry.module.css';

// To be implemented: send the industry value to backend (c#)

const INDUSTRIES = [
    'Accounting',
    'Advertising & Marketing',
    'Aerospace & Defense',
    'Agriculture & Farming',
    'Architecture & Planning',
    'Arts, Entertainment & Recreation',
    'Automotive',
    'Banking',
    'Biotechnology',
    'Broadcast Media',
    'Business Supplies & Equipment',
    'Chemicals',
    'Construction',
    'Consumer Goods',
    'Cosmetics & Beauty',
    'Education',
    'Electrical & Electronics Manufacturing',
    'Energy (Oil, Gas, Renewables)',
    'Environmental Services',
    'Events Services',
    'Fashion & Apparel',
    'Financial Services',
    'Food & Beverage',
    'Government & Public Administration',
    'Healthcare & Medical',
    'Hospitality (Hotels, Tourism)',
    'Human Resources',
    'Information Technology & Services',
    'Insurance',
    'Internet & E-commerce',
    'Legal Services',
    'Logistics & Supply Chain',
    'Manufacturing',
    'Media Production',
    'Mining & Metals',
    'Nonprofit & NGO',
    'Pharmaceuticals',
    'Real Estate',
    'Research & Development',
    'Retail',
    'Security & Investigations',
    'Sports',
    'Telecommunications',
    'Transportation',
    'Utilities',
    'Venture Capital & Private Equity',
    'Other (please specify)'
];

export default function Industry() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [error, setError] = useState(null);

    const redirectAfterDelay = (path, delaySeconds) => {
        setTimeout(() => {
            navigate(path);
        }, delaySeconds * 1000);
    };

    const backBtn = () => {
        redirectAfterDelay('/background', 1);
    }

    const nextBtn = () => {
        // retrieve from input field
        const industry = inputValue;
        if (!industry) {
            setError("Please select an industry");
            return;
        }
        redirectAfterDelay('/experience', 1);
    }

    const filteredIndustries = INDUSTRIES.filter(industry =>
        industry.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setShowDropdown(true);
    };

    const handleSelectIndustry = (industry) => {
        setInputValue(industry);
        setSelectedIndustry(industry);
        setShowDropdown(false);
    };

    return (
        <div className={styles.industry}>
            <Logo />
            <div className={styles.industryContent}>
                <div className={styles.industryCard}>
                    {error && <p className={styles.errorMessage}> {error} </p>}
                    <h3 className={styles.title}> Which industry or industries have you worked in ? </h3>
                    <div className={styles.autocompleteContainer}>
                        <input
                            type="text"
                            placeholder="e.g., Technology, Healthcare, Finance..."
                            id="industry"
                            className={styles.input}
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        />
                        {showDropdown && filteredIndustries.length > 0 && (
                            <ul className={styles.dropdown}>
                                {filteredIndustries.map((industry, index) => (
                                    <li
                                        key={index}
                                        onMouseDown={() => handleSelectIndustry(industry)}
                                        className={styles.dropdownItem}
                                    >
                                        {industry}
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