import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CvAnalysis.module.css';
import Logo from '../../components/Logo.jsx';

const BACKEND = 'http://localhost:5283';

export default function CvAnalysis() {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [cvData, setCvData] = useState(null);
    const [jobMatches, setJobMatches] = useState(null);
    const [skillGap, setSkillGap] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setError(null);
        setCvData(null);
        setJobMatches(null);
        setSkillGap(null);
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError('Please select a CV file first.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Step 1: extract skills from CV
            const formData = new FormData();
            formData.append('file', file);

            const analyzeRes = await fetch(`${BACKEND}/api/cv/analyze`, {
                method: 'POST',
                body: formData,
            });

            if (!analyzeRes.ok) {
                const err = await analyzeRes.json();
                throw new Error(err.detail || err.error || 'CV analysis failed.');
            }

            const extracted = await analyzeRes.json();
            setCvData(extracted);

            // Step 2: match against jobs
            const matchRes = await fetch(`${BACKEND}/api/cv/match-jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cvData: extracted }),
            });

            if (!matchRes.ok) {
                const err = await matchRes.json();
                throw new Error(err.error || 'Job matching failed.');
            }

            const matches = await matchRes.json();
            setJobMatches(matches);

            // Step 3: generate skill gap report
            const gapRes = await fetch(`${BACKEND}/api/cv/skill-gap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(matches),
            });

            if (!gapRes.ok) {
                const err = await gapRes.json();
                throw new Error(err.error || 'Skill gap report failed.');
            }

            const gap = await gapRes.json();
            setSkillGap(gap);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 70) return styles.scoreHigh;
        if (score >= 40) return styles.scoreMid;
        return styles.scoreLow;
    };

    return (
        <div className={styles.page}>
            <Logo />

            <div className={styles.container}>
                <h1 className={styles.title}>CV Analysis</h1>
                <p className={styles.subtitle}>Upload your CV to see matched jobs and skill insights</p>

                {/* Upload section */}
                <div className={styles.uploadCard}>
                    <input
                        type="file"
                        id="cvFile"
                        accept=".pdf,.txt"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    />
                    <label htmlFor="cvFile" className={styles.uploadLabel}>
                        <span className={styles.uploadIcon}>↑</span>
                        <span className={styles.uploadText}>
                            {file ? `✓ ${file.name}` : 'Click to upload your CV'}
                        </span>
                        <span className={styles.uploadHint}>PDF or TXT, max 5MB</span>
                    </label>

                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.actions}>
                        <button onClick={() => navigate('/dashboard')} className={styles.backBtn}>
                            Back
                        </button>
                        <button
                            onClick={handleAnalyze}
                            className={styles.analyzeBtn}
                            disabled={loading || !file}
                        >
                            {loading ? 'Analyzing...' : 'Analyze'}
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className={styles.loadingCard}>
                        <div className={styles.spinner}></div>
                        <p>Reading your CV and matching jobs...</p>
                    </div>
                )}

                {/* Extracted CV Data */}
                {cvData && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Extracted Profile</h2>
                        <div className={styles.profileCard}>
                            {cvData.name && (
                                <p className={styles.profileName}>{cvData.name}</p>
                            )}
                            {cvData.education && (
                                <p className={styles.profileDetail}>
                                    <span className={styles.label}>Education:</span> {cvData.education}
                                </p>
                            )}
                            {cvData.experienceSummary && (
                                <p className={styles.profileDetail}>
                                    <span className={styles.label}>Experience:</span> {cvData.experienceSummary}
                                </p>
                            )}
                            <div className={styles.skillsBlock}>
                                <span className={styles.label}>Skills detected:</span>
                                <div className={styles.skillTags}>
                                    {cvData.skills.map((skill, i) => (
                                        <span key={i} className={styles.skillTag}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Skill Gap Report */}
                {skillGap && skillGap.topMissingSkills.length > 0 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Top Skills to Learn</h2>
                        <div className={styles.gapCard}>
                            <p className={styles.gapSubtitle}>
                                These skills appear most often in your top matched jobs but are missing from your CV:
                            </p>
                            <div className={styles.gapList}>
                                {skillGap.topMissingSkills.map((item, i) => (
                                    <div key={i} className={styles.gapItem}>
                                        <span className={styles.gapSkill}>{item.skill}</span>
                                        <span className={styles.gapCount}>
                                            Required by {item.jobsRequiringIt} job{item.jobsRequiringIt > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Job Matches */}
                {jobMatches && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            Matched Jobs
                            <span className={styles.matchCount}>{jobMatches.length} results</span>
                        </h2>
                        <div className={styles.jobList}>
                            {jobMatches.map((job, i) => (
                                <div key={i} className={styles.jobCard}>
                                    <div className={styles.jobHeader}>
                                        <div>
                                            <h3 className={styles.jobTitle}>{job.jobTitle}</h3>
                                            <p className={styles.jobCompany}>
                                                {job.companyName}
                                                {job.location && (
                                                    <span className={styles.jobLocation}> · {job.location}</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className={`${styles.score} ${getScoreColor(job.matchScore)}`}>
                                            {job.matchScore}%
                                        </div>
                                    </div>

                                    {job.matchingSkills.length > 0 && (
                                        <div className={styles.tagGroup}>
                                            <span className={styles.tagLabel}>Matched:</span>
                                            {job.matchingSkills.map((s, j) => (
                                                <span key={j} className={styles.tagGreen}>{s}</span>
                                            ))}
                                        </div>
                                    )}

                                    {job.missingSkills.length > 0 && (
                                        <div className={styles.tagGroup}>
                                            <span className={styles.tagLabel}>Missing:</span>
                                            {job.missingSkills.map((s, j) => (
                                                <span key={j} className={styles.tagRed}>{s}</span>
                                            ))}
                                        </div>
                                    )}

                                    {job.jobUrl && (
                                        <a
                                            href={job.jobUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={styles.applyLink}
                                        >
                                            View Job →
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
