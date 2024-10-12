import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MonteCarloPi from './MonteCarloPi';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MonteCarloPi />} />
      </Routes>
    </Router>
  );
}
