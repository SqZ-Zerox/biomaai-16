
import React, { useEffect } from "react";
import AuthCallback from "@/components/auth/AuthCallback";
import { useLocation } from "react-router-dom";

const AuthCallbackPage: React.FC = () => {
  const location = useLocation();
  
  // Log information for debugging
  useEffect(() => {
    console.log("Auth callback page loaded");
    console.log("Current URL path:", location.pathname);
    console.log("URL search parameters:", location.search);
  }, [location]);
  
  return <AuthCallback />;
};

export default AuthCallbackPage;
