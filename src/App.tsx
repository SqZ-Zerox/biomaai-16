
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import LandingPage from "./pages/LandingPage"; // Import the new LandingPage
import NotFound from "./pages/NotFound";
import React from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Landing page as the main route */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Dashboard and other pages inside the Layout */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Index />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/study" element={<StudyPage />} />
                <Route path="/study-plan" element={<ProductivityHubPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/legal-essays" element={<LegalEssaysPage />} />
                <Route path="/case-brief" element={<CaseBriefPage />} />
                <Route path="/citation-tool" element={<CitationToolPage />} />
                <Route path="/flashcards" element={<FlashcardsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
