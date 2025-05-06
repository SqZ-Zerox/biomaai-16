import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

function calculateProgressColor(value: number): string {
  if (value < 40) return "bg-red-500";
  if (value < 70) return "bg-amber-500";
  return "bg-emerald-500";
}

interface HealthSnapshotProps {
  hasLabReports: boolean;
  hasCompletedQuestionnaire: boolean;
}

const HealthSnapshot: React.FC<HealthSnapshotProps> = ({ 
  hasLabReports, 
  hasCompletedQuestionnaire 
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Mock data for health metrics
  const healthMetrics = {
    overall: {
      score: 76,
      status: "Good"
    },
    categories: [
      {
        name: "Nutrition",
        score: 68,
        feedback: "Consider adding more vegetables to your diet."
      },
      {
        name: "Activity",
        score: 82,
        feedback: "Great job with regular exercise!"
      },
      {
        name: "Sleep",
        score: 65,
        feedback: "Try to get more consistent sleep hours."
      },
      {
        name: "Stress",
        score: 55,
        feedback: "High stress detected. Try relaxation techniques."
      }
    ],
    alerts: [
      {
        level: "warning",
        message: "Vitamin D slightly below optimal range"
      },
      {
        level: "danger",
        message: "Iron levels low - consult your doctor"
      }
    ]
  };

  if (!hasLabReports && !hasCompletedQuestionnaire) {
    return (
      <Card className="border-dashed border-border/60">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-muted">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Complete Your Health Profile</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Upload lab reports or complete a health questionnaire to see your personalized health snapshot.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate("/upload")}
                  className="flex-1"
                >
                  Upload Lab Reports
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/questionnaire")}
                  className="flex-1"
                >
                  Take Health Questionnaire
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">Health Snapshot</h2>
        {!hasLabReports && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 text-xs">
            Basic Insights Mode
          </Badge>
        )}
      </div>

      <Card className="relative overflow-hidden border-border/40">
        {!hasLabReports && (
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/70"></div>
        )}
        
        {hasLabReports && (
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/70"></div>
        )}
        
        <CardContent className={`p-6 ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
          {/* Overall health score */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Overall Health</h3>
              <div className="flex items-center mt-1">
                <span className={`font-bold text-lg ${
                  healthMetrics.overall.score > 70 ? 'text-emerald-500' : 
                  healthMetrics.overall.score > 40 ? 'text-amber-500' : 
                  'text-red-500'
                }`}>
                  {healthMetrics.overall.score}/100
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  {healthMetrics.overall.status}
                </span>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/progress")} 
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              Full Report
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          {/* Health metrics */}
          <div className="space-y-3">
            {healthMetrics.categories.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">{category.score}/100</span>
                </div>
                <Progress
                  value={category.score}
                  className="h-2"
                  indicatorClassName={calculateProgressColor(category.score)}
                />
                <p className="text-xs text-muted-foreground">{category.feedback}</p>
              </div>
            ))}
          </div>
          
          {/* Alerts section */}
          {healthMetrics.alerts.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold">Attention Needed</h4>
              {healthMetrics.alerts.map((alert, index) => (
                <div 
                  key={index} 
                  className={`text-xs rounded-md py-2 px-3 flex items-start gap-2 ${
                    alert.level === 'danger' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                  }`}
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>{alert.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HealthSnapshot;
