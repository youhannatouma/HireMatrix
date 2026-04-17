import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signin from './pages/authentication/Signin.jsx';
import Signup from './pages/authentication/Signup.jsx';

export default function App() {
  return (
    <div className="hire-matrix">
      <Routes>
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </div>
  );
}