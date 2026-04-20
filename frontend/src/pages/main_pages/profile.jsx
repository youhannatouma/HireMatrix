import { Link } from 'react-router-dom';
import styles from './Profile.module.css';

export default function Profile() {
  const user = {
    name: 'Alex Morgan',
    title: 'Product Manager',
    email: 'alex.morgan@example.com',
    location: 'Chicago, IL',
    joined: 'January 2024',
    accountType: 'Professional',
  };

  return (
    <div className={styles.profile}>
      <div className={styles.profileContent}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div>
              <p className={styles.overline}>Profile</p>
              <h1 className={styles.profileTitle}>Your account overview</h1>
              <p className={styles.profileDescription}>
                Review your profile details, account status, and quick actions all in one place.
              </p>
            </div>
            <Link to="/settings" className={styles.profileButton}>
              Account settings
            </Link>
          </div>

          <section className={styles.section}>
            <p className={styles.sectionTitle}>Personal details</p>
            <p className={styles.sectionText}>
              These details are used to personalize your HireMatrix experience and make your account easier to manage.
            </p>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Name</p>
                <p className={styles.detailValue}>{user.name}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Email</p>
                <p className={styles.detailValue}>{user.email}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Role</p>
                <p className={styles.detailValue}>{user.title}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Location</p>
                <p className={styles.detailValue}>{user.location}</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.sectionTitle}>Account summary</p>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Member since</p>
                <p className={styles.detailValue}>{user.joined}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Account type</p>
                <p className={styles.detailValue}>{user.accountType}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Next step</p>
                <p className={styles.detailValue}>Complete your onboarding flow</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Notifications</p>
                <p className={styles.detailValue}>Enabled</p>
              </div>
            </div>
          </section>

          <div className={styles.actionLinks}>
            <Link to="/settings" className={styles.secondaryButton}>
              Manage preferences
            </Link>
            <Link to="/background" className={styles.secondaryButton}>
              Continue background check
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
