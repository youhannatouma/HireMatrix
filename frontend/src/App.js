import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signin from './pages/authentication/signin.jsx';
import Signup from './pages/authentication/signup.jsx';
import Background from './pages/background_check/background.jsx';
import EmailVerification from './pages/authentication/EmailVerification.jsx';
import TermsOfService from './pages/policy/TermsOfService.jsx';
import PrivacyPolicy from './pages/policy/PrivacyPolicy.jsx';
import Industry from './pages/background_check/industry.jsx';
import Experience from './pages/background_check/experience.jsx';
import Position from './pages/background_check/position.jsx';
import Education from './pages/background_check/education.jsx'
import Languages from './pages/background_check/languages.jsx';
import Location from './pages/background_check/location.jsx';
import Preferences from './pages/background_check/preferences.jsx';
import ResumeUpload from './pages/background_check/ResumeUpload.jsx';
import Message from './pages/background_check/Welcome.jsx';
import Profile from './pages/main_pages/profile.jsx';
import Settings from './pages/main_pages/settings.jsx';
import CvAnalysis from './pages/main_pages/CvAnalysis.jsx';

export default function App() {
  return (
    <div className="hire-matrix">
      <Routes>
        {/* auth endpoints */}
        <Route path='/' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/email-verification' element={<EmailVerification />} />
        {/* policy endpoints */}
        <Route path='/terms-of-service' element={<TermsOfService />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        {/* background questions */}
        <Route path='/background' element={<Background />} />
        <Route path='/industry' element={<Industry />} />
        <Route path='/experience' element={<Experience />} />
        <Route path='/position' element={<Position />} />
        <Route path='/education' element={<Education />} />
        <Route path='/languages' element={<Languages />} />
        <Route path='/location' element={<Location />} />
        <Route path='/preferences' element={<Preferences />} />
        <Route path='/resume-upload' element={<ResumeUpload />} />
        <Route path='/welcome' element={<Message />} />
        {/* Main dashboard pages */}
        <Route path='/dashboard' element={<Profile />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/cv-analysis' element={<CvAnalysis />} />
      </Routes>
    </div>
  );
}