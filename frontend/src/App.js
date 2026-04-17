import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signin from './pages/authentication/Signin.jsx';
import Signup from './pages/authentication/Signup.jsx';
import Background from './pages/background_check/Background.jsx';
import EmailVerification from './pages/authentication/EmailVerification.jsx';
import TermsOfService from './pages/policy/TermsOfService.jsx';
import PrivacyPolicy from './pages/policy/PrivacyPolicy.jsx';

export default function App() {
  return (
    <div className="hire-matrix">
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/background' element={<Background />} />
        <Route path='/email-verification' element={<EmailVerification />} />
        <Route path='/terms-of-service' element={<TermsOfService />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
      </Routes>
    </div>
  );
}