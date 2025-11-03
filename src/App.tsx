import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MonitoringPage from '@/pages/MonitoringPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/monitoring" replace />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

