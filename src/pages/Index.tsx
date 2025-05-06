
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GeneticAnalysisBanner from "@/components/dashboard/GeneticAnalysisBanner";
import GeneticFeatureSection from "@/components/dashboard/GeneticFeatureSection";

const Index: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Welcome to BIOMA AI</h1>
        
        {/* Genetic Analysis Banner */}
        <GeneticAnalysisBanner />
        
        <Card className="mb-8 border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Your Health Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use BIOMA AI to analyze your lab tests today, while we develop our advanced genetic analysis capabilities.
            </p>
            <p>Select a feature from the sidebar to get started with your health journey.</p>
          </CardContent>
        </Card>
        
        {/* Feature section highlighting genetic analysis */}
        <GeneticFeatureSection />
      </motion.div>
    </div>
  );
};

export default Index;
