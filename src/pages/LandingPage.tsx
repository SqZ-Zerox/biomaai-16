
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle, Shield, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Case Brief Generator",
      description: "Transform complex legal cases into clear, concise briefs in seconds."
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      title: "AI Legal Assistant",
      description: "Get instant answers to your legal questions with advanced AI technology."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Productivity Tools",
      description: "Stay organized with task management tools designed specifically for law students."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Minimal Navigation */}
      <nav className="w-full py-4 px-6 flex justify-between items-center border-b border-border/30 bg-background/70 backdrop-blur-sm fixed top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="neon-border rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10">
            <span className="text-primary font-bold">L</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Legal<span className="text-primary">Aid</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-sm font-medium"
            onClick={() => navigate("/study-plan")}
          >
            Dashboard
          </Button>
          <Button 
            className="gap-1"
            onClick={() => navigate("/study-plan")}
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Legal Study Assistant</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Transform Your Law School Experience
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              The ultimate AI study companion for law students. Simplify complex legal concepts, 
              generate case briefs, and boost your productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => navigate("/study-plan")}
              >
                Access Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/chat")}
              >
                Try AI Assistant
              </Button>
            </div>
          </motion.div>
          
          {/* Abstract shapes in background */}
          <div className="absolute top-1/4 -left-24 w-64 h-64 rounded-full bg-primary/5 filter blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-24 w-80 h-80 rounded-full bg-primary/5 filter blur-3xl"></div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-card/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Tools for Law Students</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite of features is designed to help you excel in your legal studies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/20 transition-all">
                  <CardContent className="pt-6">
                    <div className="mb-4 p-2 rounded-full bg-primary/10 w-fit">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist CTA */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            className="bg-primary/5 border border-primary/10 rounded-xl p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your law school experience?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Access your dashboard now and discover how LegalAid can help you excel in your studies.
            </p>
            <Button 
              size="lg" 
              className="gap-2"
              onClick={() => navigate("/study-plan")}
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 lg:px-24 border-t border-border/30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="neon-border rounded-full p-1.5 w-8 h-8 flex items-center justify-center bg-primary/10">
              <span className="text-primary font-bold text-sm">L</span>
            </div>
            <h1 className="text-lg font-bold text-foreground">Legal<span className="text-primary">Aid</span></h1>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2025 LegalAid. Created by Zawad
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
