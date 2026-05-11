import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Settings.module.css';

export default function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  const handleReset = () => {
    setEmailAlerts(true);
    setMarketing(false);
    setDarkMode(false);
    setSaved(false);
  };

  return (
    <div className={styles.settings}>
      <div className={styles.settingsContent}>
        <div className={styles.settingsCard}>
          <div className={styles.settingsHeader}>
            <div>
              <p className={styles.overline}>Settings</p>
              <h1 className={styles.settingsTitle}>Account preferences</h1>
              <p className={styles.settingsDescription}>
                Control your notification and display preferences in one place.
              </p>
            </div>
            <Link to="/profile" className={styles.linkButton}>
              Back to profile
            </Link>
          </div>

          {saved && <div className={styles.message}>Your settings have been saved.</div>}

          <form className={styles.settingsForm} onSubmit={handleSave}>
            <div className={styles.settingsSection}>
              <p className={styles.sectionTitle}>Notifications</p>

              <div className={styles.settingRow}>
                <div>
                  <p className={styles.settingLabel}>Email alerts</p>
                  <p className={styles.settingDescription}>
                    Receive notifications about new hiring opportunities and account activity.
                  </p>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={() => setEmailAlerts(!emailAlerts)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.settingRow}>
                <div>
                  <p className={styles.settingLabel}>Marketing updates</p>
                  <p className={styles.settingDescription}>
                    Get occasional product updates and newsletter announcements.
                  </p>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={() => setMarketing(!marketing)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
            </div>

            <div className={styles.settingsSection}>
              <p className={styles.sectionTitle}>Appearance</p>

              <div className={styles.settingRow}>
                <div>
                  <p className={styles.settingLabel}>Dark mode</p>
                  <p className={styles.settingDescription}>
                    Enable the darker interface style for late-night work sessions.
                  </p>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
            </div>

            <div className={styles.saveGroup}>
              <button type="submit" className={styles.saveButton}>
                Save changes
              </button>
              <button type="button" className={styles.resetButton} onClick={handleReset}>
                Reset to defaults
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
