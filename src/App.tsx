
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/layout/Layout";
import "./App.css";
import { DemoModeProvider } from "./contexts/DemoModeContext";
import { Toaster } from "./components/ui/toaster";
import { initializeAPIKeys } from "./services/apiKeyInitializer";

// Pages
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import StudyPage from "./pages/StudyPage";
import StudyPlanPage from "./pages/StudyPlanPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import LegalEssaysPage from "./pages/LegalEssaysPage";
import CitationToolPage from "./pages/CitationToolPage";
import CaseBriefPage from "./pages/CaseBriefPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import NotFound from "./pages/NotFound";
import UploadPage from "./pages/UploadPage";
import FitnessPage from "./pages/FitnessPage";
import NutritionPage from "./pages/NutritionPage";
import ChatPage from "./pages/ChatPage";

// Dashboard layout wrapper component
const DashboardLayout = ({ toggleDarkMode, isDarkMode }: { toggleDarkMode: () => void; isDarkMode: boolean }) => {
  return (
    <Layout toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}>
      <Outlet />
    </Layout>
  );
};

// Initialize the app
function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const storedMode = localStorage.getItem("bioma_dark_mode");
    return storedMode ? JSON.parse(storedMode) : false;
  });

  useEffect(() => {
    // Initialize API keys on app load
    initializeAPIKeys();
    // Save dark mode preference to localStorage
    localStorage.setItem("bioma_dark_mode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DemoModeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          
          {/* Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={<DashboardLayout toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />}
          >
            <Route index element={<Index />} />
            <Route path="study" element={<StudyPage />} />
            <Route path="study-plan" element={<StudyPlanPage />} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="legal-essays" element={<LegalEssaysPage />} />
            <Route path="citation-tool" element={<CitationToolPage />} />
            <Route path="case-brief" element={<CaseBriefPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="fitness" element={<FitnessPage />} />
            <Route path="nutrition" element={<NutritionPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
      </Router>
    </DemoModeProvider>
  );
}

export default App;
