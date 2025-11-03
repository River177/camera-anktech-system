import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MonitoringPage from '@/pages/MonitoringPage';
import DiagnosticPage from '@/pages/DiagnosticPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/monitoring" replace />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/diagnostic" element={<DiagnosticPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

