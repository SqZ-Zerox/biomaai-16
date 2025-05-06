
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GeneticAnalysisBanner from "@/components/dashboard/GeneticAnalysisBanner";
import GeneticFeatureSection from "@/components/dashboard/GeneticFeatureSection";
import { Dna, TestTube } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Index: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-primary/15">
            <Dna className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome to BIOMA<span className="text-primary">AI</span></h1>
            <p className="text-muted-foreground">The future of genetic insights for personalized health</p>
          </div>
        </div>
        
        {/* Genetic Analysis Banner */}
        <GeneticAnalysisBanner />
        
        <Card className="mb-8 border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              <CardTitle>Lab Test Analysis Showcase</CardTitle>
              <Badge variant="outline" className="bg-background text-muted-foreground border-muted/40 text-xs">Available Now</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              While our advanced genetic analysis capabilities are in development, explore our lab test analysis 
              feature today to get a glimpse of what BIOMA AI will offer in the future.
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
