
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, TrendingUp, Settings } from "lucide-react";

interface SettingsAndGrowthProps {
  hasLabReports: boolean;
}

const SettingsAndGrowth: React.FC<SettingsAndGrowthProps> = ({ hasLabReports }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lab Report Hub */}
        <Card className="shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Lab Report Hub
            </CardTitle>
            <CardDescription>
              Manage and track your health data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasLabReports ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  View your uploaded lab reports and track changes over time
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-primary/30 text-primary hover:bg-primary hover:text-white"
                    onClick={() => navigate("/upload")}
                  >
                    Add New Report
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/lab-history")}
                  >
                    View History
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your lab reports to get personalized health insights
                </p>
                <Button 
                  onClick={() => navigate("/upload")}
                  className="w-full"
                >
                  Upload Lab Report
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Progress & Settings */}
        <Card className="shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Health Journey
            </CardTitle>
            <CardDescription>
              Track progress and manage settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Set health goals, track progress, and customize your experience
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/progress")}
              >
                View Progress
              </Button>
              <Button 
                variant="outline"
                className="flex-1 flex items-center gap-1"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SettingsAndGrowth;
