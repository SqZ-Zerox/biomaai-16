
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/layout/Layout";
import "./App.css";
import { DemoModeProvider } from "./contexts/DemoModeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { initializeAPIKeys } from "./services/apiKeyInitializer";
import { useAuth } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import NotFound from "./pages/NotFound";
import UploadPage from "./pages/UploadPage";
import FitnessPage from "./pages/FitnessPage";
import NutritionPage from "./pages/NutritionPage";
import ChatPage from "./pages/ChatPage";
import RecipeSuggestionsPage from "./pages/RecipeSuggestionsPage";
import SettingsPage from "./pages/SettingsPage";
import LabDetailsPage from "./pages/LabDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import ProgressTrackingPage from "./pages/ProgressTrackingPage";

// Protected route component that requires authentication and email verification
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, isEmailVerified } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

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
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => {
    const storedMode = localStorage.getItem("bioma_dark_mode");
    return storedMode ? JSON.parse(storedMode) : false;
  });

  React.useEffect(() => {
    // Initialize API keys on app load
    initializeAPIKeys();
    
    // Save dark mode preference to localStorage
    localStorage.setItem("bioma_dark_mode", JSON.stringify(isDarkMode));
    
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AuthProvider>
      <DemoModeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            
            {/* Dashboard Routes - Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />}>
                <Route index element={<Index />} />
              </Route>
              
              {/* Top level routes that use layout */}
              <Route element={<DashboardLayout toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />}>
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/fitness" element={<FitnessPage />} />
                <Route path="/nutrition" element={<NutritionPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/progress" element={<ProgressTrackingPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/lab-details" element={<LabDetailsPage />} />
                <Route path="/lab-details/:reportId" element={<LabDetailsPage />} />
                <Route path="/lab-details/:category" element={<LabDetailsPage />} />
              </Route>
              
              {/* Recipe suggestions page - Protected */}
              <Route path="/recipes" element={
                <Layout toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}>
                  <RecipeSuggestionsPage />
                </Layout>
              } />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
        </Router>
      </DemoModeProvider>
    </AuthProvider>
  );
}

export default App;
