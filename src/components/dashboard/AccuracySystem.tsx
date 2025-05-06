
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CircleCheck, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AccuracySystemProps {
  hasLabReports: boolean;
  hasCompletedQuestionnaire: boolean;
}

const AccuracySystem: React.FC<AccuracySystemProps> = ({ hasLabReports, hasCompletedQuestionnaire }) => {
  const navigate = useNavigate();
  
  // Determine the confidence level
  let confidenceLevel: "low" | "medium" | "high" = "low";
  if (hasLabReports) {
    confidenceLevel = "high";
  } else if (hasCompletedQuestionnaire) {
    confidenceLevel = "medium";
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-sm border-border/40">
        <CardHeader className="pb-2">
          <CardTitle>Accuracy Optimization</CardTitle>
          <CardDescription>
            Improve the accuracy of your health insights
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Data Confidence Badge */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Data Confidence:</span>
            </div>
            {confidenceLevel === "low" && (
              <Badge className="bg-destructive/15 text-destructive border-destructive/20 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Questionnaire Only
              </Badge>
            )}
            {confidenceLevel === "medium" && (
              <Badge className="bg-yellow-500/15 text-yellow-600 border-yellow-500/20 flex items-center gap-1">
                <FileWarning className="h-3 w-3" />
                Partial Data
              </Badge>
            )}
            {confidenceLevel === "high" && (
              <Badge className="bg-green-500/15 text-green-600 border-green-500/20 flex items-center gap-1">
                <CircleCheck className="h-3 w-3" />
                Full Dataset
              </Badge>
            )}
          </div>
          
          {/* Lab Reminder Engine */}
          {!hasLabReports && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Lab Reminder Engine</h3>
              <div className="p-3 border border-dashed border-border/60 rounded-md bg-background">
                <p className="text-sm text-muted-foreground mb-3">
                  {confidenceLevel === "low" 
                    ? "Complete the health questionnaire to get initial insights" 
                    : "Upload lab reports for more accurate health analysis"}
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate(confidenceLevel === "low" ? "/questionnaire" : "/upload")}
                  className="w-full"
                >
                  {confidenceLevel === "low" ? "Start Questionnaire" : "Upload Lab Reports"}
                </Button>
              </div>
            </div>
          )}
          
          {/* Next Recommended Action */}
          {hasLabReports && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Next Check-up</h3>
              <div className="p-3 border border-dashed border-border/60 rounded-md bg-background">
                <p className="text-sm text-muted-foreground mb-1">
                  Recommended follow-up tests:
                </p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 mb-3">
                  <li>Vitamin D (last checked 3 months ago)</li>
                  <li>Complete Blood Count (last checked 6 months ago)</li>
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/lab-reminders")}
                  className="w-full"
                >
                  Set Reminders
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AccuracySystem;
