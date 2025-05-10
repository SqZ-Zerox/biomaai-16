
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
    
    const params = new URLSearchParams(location.search);
    const token = params.get('token_hash') || params.get('token');
    const type = params.get('type');
    
    console.log("Token:", token);
    console.log("Type:", type);
    
    // Check all query parameters
    params.forEach((value, key) => {
      console.log(`Parameter ${key}:`, value);
    });
  }, [location]);
  
  return <AuthCallback />;
};

export default AuthCallbackPage;
