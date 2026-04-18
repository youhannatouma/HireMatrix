import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signin from './pages/authentication/Signin.jsx';
import Signup from './pages/authentication/Signup.jsx';
import Background from './pages/background_check/Background.jsx';
import EmailVerification from './pages/authentication/EmailVerification.jsx';
import TermsOfService from './pages/policy/TermsOfService.jsx';
import PrivacyPolicy from './pages/policy/PrivacyPolicy.jsx';
import Industry from './pages/background_check/Industry.jsx';
import Experience from './pages/background_check/Experience.jsx';
import Position from './pages/background_check/Position.jsx';
import Education from './pages/background_check/Education.jsx'
import Languages from './pages/background_check/Languages.jsx';
import Location from './pages/background_check/Location.jsx';
import Preferences from './pages/background_check/Preferences.jsx';
import ResumeUpload from './pages/background_check/ResumeUpload.jsx';
import Message from './pages/background_check/Welcome.jsx';

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
      </Routes>
    </div>
  );
}