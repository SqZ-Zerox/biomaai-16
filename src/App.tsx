
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import StudyPage from "./pages/StudyPage";
import ProductivityHubPage from "./pages/StudyPlanPage";
import UploadPage from "./pages/UploadPage";
import LegalEssaysPage from "./pages/LegalEssaysPage";
import CaseBriefPage from "./pages/CaseBriefPage";
import CitationToolPage from "./pages/CitationToolPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NutritionPage from "./pages/NutritionPage";
import FitnessPage from "./pages/FitnessPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import NotFound from "./pages/NotFound";
import React, { useState, useEffect, createContext, useContext } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Create demo mode context
export const DemoModeContext = createContext({
  isDemoMode: false,
  setIsDemoMode: (value: boolean) => {}
});

export const useDemoMode = () => useContext(DemoModeContext);

// Layout wrapper with dark mode state
const LayoutWithDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Get saved preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Update body class when theme changes
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <Layout toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}>
      <Outlet />
    </Layout>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isDemoMode } = useDemoMode();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!isAuthenticated && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check local storage for demo mode on initial load
  useEffect(() => {
    const storedDemoMode = localStorage.getItem("demoMode");
    if (storedDemoMode === "true") {
      setIsDemoMode(true);
    }
  }, []);

  // Update local storage when demo mode changes
  useEffect(() => {
    localStorage.setItem("demoMode", isDemoMode.toString());
  }, [isDemoMode]);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <DemoModeContext.Provider value={{ isDemoMode, setIsDemoMode }}>
          <AuthProvider>
            <BrowserRouter>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Landing page as the main route */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Auth routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />
                  
                  {/* Dashboard and other pages inside the Layout - protected */}
                  <Route element={
                    <ProtectedRoute>
                      <LayoutWithDarkMode />
                    </ProtectedRoute>
                  }>
                    <Route path="/dashboard" element={<Index />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/study" element={<StudyPage />} />
                    <Route path="/study-plan" element={<ProductivityHubPage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/legal-essays" element={<LegalEssaysPage />} />
                    <Route path="/case-brief" element={<CaseBriefPage />} />
                    <Route path="/citation-tool" element={<CitationToolPage />} />
                    <Route path="/flashcards" element={<FlashcardsPage />} />
                    {/* New routes for nutrition and fitness */}
                    <Route path="/nutrition" element={<NutritionPage />} />
                    <Route path="/fitness" element={<FitnessPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </BrowserRouter>
          </AuthProvider>
        </DemoModeContext.Provider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
