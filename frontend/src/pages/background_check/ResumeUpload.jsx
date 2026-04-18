import styles from './ResumeUpload.module.css';
import Logo from '../../components/Logo.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ResumeUpload() {
    const navigate = useNavigate();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [error, setError] = useState(null);

    const redirectAfterDelay = (path, delaySeconds) => {
        setTimeout(() => {
            navigate(path);
        }, delaySeconds * 1000);
    };

    const backBtn = () => {
        redirectAfterDelay('/preferences', 1);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
            setError(null);
        }
    };

    const nextBtn = () => {
        // ensure user uploaded a file
        if (!uploadedFile) {
            setError('Please upload your resume');
            return;
        }

        // put file inside a variable
        const resumeFile = uploadedFile;
        // TODO: Send this file to backend
        console.log('Resume file ready for upload:', resumeFile);

        setError(null);
        redirectAfterDelay('/welcome', 1);
    };

    return (
        <div className={styles.resumeUpload}>
            <Logo />
            <div className={styles.resumeUploadContent}>
                <div className={styles.resumeUploadCard}>
                    {error && <p className={styles.errorMessage}> {error} </p>}
                    <h3 className={styles.title}> Upload your resume </h3>
                    <p className={styles.subtitle}> Help us get to know you better </p>

                    <div className={styles.uploadArea}>
                        <input
                            type="file"
                            id="resumeFile"
                            className={styles.fileInput}
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.txt"
                        />
                        <label htmlFor="resumeFile" className={styles.uploadLabel}>
                            <div className={styles.uploadIcon}>↑</div>
                            <p className={styles.uploadText}>
                                {uploadedFile ? `✓ ${uploadedFile.name}` : 'Click to upload or drag and drop'}
                            </p>
                            <p className={styles.uploadHint}>
                                PDF, DOC, DOCX or TXT (Max 5MB)
                            </p>
                        </label>
                    </div>

                    <div className={styles.buttonContainer}>
                        <button onClick={backBtn} className={styles.backBtn}> Back </button>
                        <button onClick={nextBtn} className={styles.nextBtn}> Complete </button>
                    </div>
                </div>
            </div>
        </div>
    );
}