import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signin from './pages/authentication/signin.jsx';

export default function App() {
  return (
    <div className="hire-matrix">
      <Routes>
        <Route path='/' element={<Signin />} />
      </Routes>
    </div>
  );
}