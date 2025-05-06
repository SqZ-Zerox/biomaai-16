
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Heart, BadgeAlert } from "lucide-react";

interface HealthSnapshotProps {
  hasLabReports: boolean;
  hasCompletedQuestionnaire: boolean;
}

const HealthSnapshot: React.FC<HealthSnapshotProps> = ({ hasLabReports, hasCompletedQuestionnaire }) => {
  // Mock data - in a real app, this would come from your API or state management
  const mockBiomarkers = [
    { name: "Vitamin D", value: 20, min: 30, max: 100, unit: "ng/mL", status: "low" },
    { name: "Total Cholesterol", value: 210, min: 125, max: 200, unit: "mg/dL", status: "high" },
    { name: "HDL", value: 40, min: 60, max: 100, unit: "mg/dL", status: "low" },
    { name: "Blood Glucose", value: 87, min: 70, max: 99, unit: "mg/dL", status: "normal" },
  ];

  // Mock wellness score for questionnaire-based insights
  const wellnessScore = 72;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm border-border/40">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Health Snapshot</CardTitle>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {hasLabReports ? "Lab-Based" : "Basic Insights"}
            </Badge>
          </div>
          <CardDescription>
            {hasLabReports 
              ? "Based on your latest lab reports" 
              : "Based on your health questionnaire"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {hasLabReports ? (
            <div className="space-y-4">
              {mockBiomarkers.map((biomarker, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {biomarker.status === "low" && (
                        <Badge className="mr-2 bg-destructive/15 text-destructive border-destructive/20">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Low
                        </Badge>
                      )}
                      {biomarker.status === "high" && (
                        <Badge className="mr-2 bg-yellow-500/15 text-yellow-600 border-yellow-500/20">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          High
                        </Badge>
                      )}
                      <span className="text-sm font-medium">{biomarker.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {biomarker.value} {biomarker.unit}
                    </span>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full ${
                        biomarker.status === "low" 
                          ? "bg-destructive/70" 
                          : biomarker.status === "high" 
                            ? "bg-yellow-500/70" 
                            : "bg-green-500/70"
                      }`}
                      style={{
                        width: `${((biomarker.value - biomarker.min) / (biomarker.max - biomarker.min)) * 100}%`,
                        left: biomarker.value < biomarker.min ? 0 : undefined,
                        right: biomarker.value > biomarker.max ? 0 : undefined,
                      }}
                    ></div>
                    <div className="absolute inset-0 flex justify-between px-1">
                      <span className="text-[9px] text-muted-foreground">{biomarker.min}</span>
                      <span className="text-[9px] text-muted-foreground">{biomarker.max}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {biomarker.status === "low" && `Your levels are below the ideal range (${biomarker.min}-${biomarker.max} ${biomarker.unit})`}
                    {biomarker.status === "high" && `Your levels are above the ideal range (${biomarker.min}-${biomarker.max} ${biomarker.unit})`}
                    {biomarker.status === "normal" && `Your levels are within the ideal range (${biomarker.min}-${biomarker.max} ${biomarker.unit})`}
                  </p>
                </div>
              ))}
              
              <div className="mt-6 p-3 bg-destructive/10 rounded-md border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="text-destructive h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-destructive">Attention Required</h4>
                  <p className="text-xs text-destructive/80 mt-0.5">
                    Low Vitamin D levels detected. Consider consulting with your healthcare provider.
                  </p>
                </div>
              </div>
            </div>
          ) : hasCompletedQuestionnaire ? (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <div className="flex justify-center mb-2">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-1">Wellness Score</h3>
                <p className="text-sm text-muted-foreground">Based on your questionnaire responses</p>
              </div>
              
              <div className="relative pt-6 pb-2">
                <Progress value={wellnessScore} className="h-3" />
                <div className="absolute inset-x-0 -top-1 flex justify-between px-1">
                  <span className="text-xs text-muted-foreground">0</span>
                  <span className="text-xs text-muted-foreground">100</span>
                </div>
                <div className="absolute -bottom-1 inset-x-0 flex justify-center">
                  <Badge className="bg-primary text-primary-foreground font-medium">
                    {wellnessScore}/100
                  </Badge>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-blue-500/10 rounded-md border border-blue-500/20 flex items-start gap-3">
                <BadgeAlert className="text-blue-500 h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">Basic Insights Mode</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Upload lab reports for more accurate health insights and personalized recommendations.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <BadgeAlert className="h-10 w-10 text-primary mb-2" />
              <h3 className="text-lg font-semibold mb-1">Complete Your Health Profile</h3>
              <p className="text-sm text-center text-muted-foreground mb-4">
                Take our health questionnaire to get personalized insights
              </p>
              <Button>Start Questionnaire</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HealthSnapshot;
