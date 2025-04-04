
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import StudyPage from "./pages/StudyPage";
import StudyPlanPage from "./pages/StudyPlanPage";
import UploadPage from "./pages/UploadPage";
import LegalEssaysPage from "./pages/LegalEssaysPage";
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/study" element={<StudyPage />} />
                <Route path="/study-plan" element={<StudyPlanPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/legal-essays" element={<LegalEssaysPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
