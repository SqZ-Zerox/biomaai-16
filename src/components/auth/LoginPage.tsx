
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="w-full">
      <AuthForm />
    </div>
  );
};

export default LoginPage;
