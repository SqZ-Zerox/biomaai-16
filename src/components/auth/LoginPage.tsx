
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AuthForm from "./AuthForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 border-b border-border/40 bg-background/95 backdrop-blur-sm w-full z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="neon-border rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10">
              <span className="text-primary font-bold">L</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Legal<span className="text-primary">Aid</span></h1>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-primary/5 filter blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
          <div className="absolute bottom-1/3 right-1/6 w-80 h-80 rounded-full bg-primary/5 filter blur-3xl animate-pulse" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
        </div>
        
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border/30 shadow-xl bg-card/60 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Welcome to LegalAid</CardTitle>
                <CardDescription className="text-center">
                  Sign in to access your legal study resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuthForm />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <footer className="py-4 px-6 border-t border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 LegalAid. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
