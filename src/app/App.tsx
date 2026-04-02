import { Navigate, Route, Routes } from 'react-router';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tools/:toolId" element={<ToolPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
