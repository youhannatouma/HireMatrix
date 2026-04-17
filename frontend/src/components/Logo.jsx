import styles from './Logo.module.css';

export default function Logo() {
    return (
        <div className={styles.logoContainer}>
            <div className={styles.logoContent}>
                <span className={styles.logoText}>Hire Matrix</span>
                <img src="/star.svg" alt="star" className={styles.starIcon} />
            </div>
        </div>
    );
}