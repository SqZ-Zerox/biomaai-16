
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, CheckCircle, AlertTriangle, ArrowRight, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getLatestLabReport, LabInsight, LabResult, LabReport } from "@/services/lab-reports";
import { useToast } from "@/hooks/use-toast";

const LabReportOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<LabReport | null>(null);
  const [results, setResults] = useState<LabResult[] | null>(null);
  const [insights, setInsights] = useState<LabInsight | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { report, results, insights, error } = await getLatestLabReport(user.id);
        
        if (error) {
          console.error("Error fetching lab report:", error);
          setError(error);
        } else {
          setReport(report);
          setResults(results);
          setInsights(insights);
        }
      } catch (err: any) {
        console.error("Failed to fetch lab report data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Group results by status
  const categorizedResults = results ? 
    results.reduce<Record<string, LabResult[]>>((acc, result) => {
      const status = 
        result.status === 'critical' ? 'critical' :
        (result.status === 'high' || result.status === 'low') ? 'warning' : 'normal';
      
      if (!acc[status]) acc[status] = [];
      acc[status].push(result);
      return acc;
    }, {}) : {};
  
  // Prepare data for display
  const labCategories = [
    {
      name: "Critical Attention",
      count: categorizedResults.critical?.length || 0,
      status: "critical",
      icon: <AlertCircle className="h-4 w-4" />,
      items: (categorizedResults.critical || []).slice(0, 3)
    },
    {
      name: "Monitoring Needed",
      count: categorizedResults.warning?.length || 0,
      status: "warning",
      icon: <AlertTriangle className="h-4 w-4" />,
      items: (categorizedResults.warning || []).slice(0, 3)
    },
    {
      name: "Optimal Range",
      count: categorizedResults.normal?.length || 0,
      status: "normal",
      icon: <CheckCircle className="h-4 w-4" />,
      items: (categorizedResults.normal || []).slice(0, 3)
    },
  ];
  
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Lab Report Overview</CardTitle>
              </div>
            </div>
            <CardDescription>
              Loading your lab data...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader className="h-8 w-8 text-primary animate-spin" />
              <p className="text-muted-foreground">Retrieving your latest lab report</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  if (!report || !results || results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-sm border-border/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Lab Report Overview</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/upload")}
                className="border-primary/30 text-primary hover:bg-primary hover:text-white"
              >
                Upload New Report
              </Button>
            </div>
            <CardDescription>
              {error ? "Error retrieving lab data" : "No lab reports uploaded yet"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-8">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
              <div>
                <h3 className="text-lg font-medium mb-1">No Lab Results Found</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  {error 
                    ? "There was an error retrieving your lab data. Please try again later."
                    : "Upload your lab reports to get personalized insights and recommendations."}
                </p>
                <Button onClick={() => navigate("/upload")}>
                  Upload Your First Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm border-border/40">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Lab Report Overview</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/upload")}
              className="border-primary/30 text-primary hover:bg-primary hover:text-white"
            >
              Upload New Report
            </Button>
          </div>
          <CardDescription>
            Summary of your latest lab results
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {labCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`
                        ${category.status === "critical" ? "bg-destructive text-destructive-foreground" : ""}
                        ${category.status === "warning" ? "bg-yellow-500 text-white" : ""}
                        ${category.status === "normal" ? "bg-green-500 text-white" : ""}
                      `}
                    >
                      {category.icon}
                      <span className="ml-1">{category.count}</span>
                    </Badge>
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={() => navigate(`/lab-details/${category.status}`)}
                  >
                    View All
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                      <span className="text-sm">{item.biomarker_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {item.value}{item.unit ? ` ${item.unit}` : ''}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full
                            ${item.status === "critical" ? "bg-destructive" : ""}
                            ${item.status === "high" || item.status === "low" ? "bg-yellow-500" : ""}
                            ${item.status === "normal" ? "bg-green-500" : ""}
                          `}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="pt-3 border-t border-border">
              <h3 className="font-semibold mb-2">Next Steps</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {insights && insights.warnings && insights.warnings.length > 0 ? (
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <span>{insights.warnings[0]}</span>
                  </li>
                ) : null}
                
                {insights && insights.recommendations && insights.recommendations.length > 0 ? (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>{insights.recommendations[0]}</span>
                  </li>
                ) : null}
              </ul>
              <Button 
                className="mt-4 w-full"
                onClick={() => navigate("/lab-details")}
              >
                View Detailed Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LabReportOverview;
