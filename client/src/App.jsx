// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

/* שים לב שהשמות תואמים לקבצים! */
import HomePage     from "@/pages/HomePage";
import LoginPage    from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DailyPage    from "@/pages/DailyPage";  // זה העמוד עם הכרטיסים
import Dashboard    from "@/pages/Dashboard";  // זה העמוד עם המנעולים והימים
import NotFoundPage from "@/pages/NotFoundPage";
import SimulationPage from "@/pages/SimulationPage"; // 1. הוסף את הייבוא הזה
import GamesPage from './pages/GamesPage';
import DeepDrillPage from "@/pages/DeepDrillPage"; // תוסיף למעלה ב-Imports

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index           element={<HomePage />} />
        <Route path="login"    element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* תוודא שהשורות האלו קיימות ונכונות: */}
        <Route path="dashboard" element={<Dashboard />} /> 
        <Route path="daily"     element={<DailyPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="deep-drill" element={<DeepDrillPage />} />
        <Route path="simulation" element={<SimulationPage />} />
        <Route element={<ProtectedRoute />}>
           {/* עמודים מוגנים */}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}