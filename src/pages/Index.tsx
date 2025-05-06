
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText, ArrowRight, Brain, Dumbbell, Apple, MessageCircle } from "lucide-react";
import HealthSnapshot from "@/components/dashboard/HealthSnapshot";
import ActionCards from "@/components/dashboard/ActionCards";
import LabReportOverview from "@/components/dashboard/LabReportOverview";
import FeaturesOverview from "@/components/dashboard/FeaturesOverview";
import AccuracySystem from "@/components/dashboard/AccuracySystem";
import SettingsAndGrowth from "@/components/dashboard/SettingsAndGrowth";
import BiomaBotButton from "@/components/dashboard/BiomaBotButton";
import GeneticAnalysisBanner from "@/components/dashboard/GeneticAnalysisBanner";

const Index = () => {
  // Mock state for demonstration - in a real app, this would come from your data store
  const [hasLabReports, setHasLabReports] = useState(false);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(true);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome to BIOMA AI
          </h1>
          <p className="text-muted-foreground mb-6">
            Your personalized health insights platform
          </p>
        </motion.div>
        
        {/* Genetic Analysis Banner - Kept from previous implementation */}
        <GeneticAnalysisBanner />
        
        {/* Main sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Health Snapshot and Accuracy System */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <HealthSnapshot hasLabReports={hasLabReports} hasCompletedQuestionnaire={hasCompletedQuestionnaire} />
            <AccuracySystem hasLabReports={hasLabReports} hasCompletedQuestionnaire={hasCompletedQuestionnaire} />
          </div>
          
          {/* Right column - Action Cards and Features Overview */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ActionCards />
            <FeaturesOverview />
            <SettingsAndGrowth hasLabReports={hasLabReports} />
          </div>
        </div>
        
        {/* Floating Bioma Bot button */}
        <BiomaBotButton />
      </div>
    </div>
  );
};

export default Index;
