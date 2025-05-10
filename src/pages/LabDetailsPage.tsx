
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getLabReportDetails, getUserLabReports, LabInsight, LabReport, LabResult } from "@/services/lab-reports";
import LabResultsDisplay from "@/components/lab-reports/LabResultsDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Loader, RefreshCcw } from "lucide-react";

const LabDetailsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<LabReport | null>(null);
  const [results, setResults] = useState<LabResult[] | null>(null);
  const [insights, setInsights] = useState<LabInsight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const fetchReportData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      if (reportId) {
        // Fetch specific report
        const { report, results, insights, error } = await getLabReportDetails(reportId);
        
        if (error) {
          setError(error);
        } else {
          setReport(report);
          setResults(results);
          setInsights(insights);
        }
      } else {
        // No report ID provided, get the latest report
        const { reports, error: reportsError } = await getUserLabReports(user.id);
        
        if (reportsError || !reports || reports.length === 0) {
          setError(reportsError || "No lab reports found");
        } else {
          // Get the latest analyzed report
          const latestReport = reports.find(r => r.status === "analyzed") || reports[0];
          
          if (!latestReport) {
            setError("No analyzed lab reports found");
          } else {
            const { report, results, insights, error } = await getLabReportDetails(latestReport.id);
            
            if (error) {
              setError(error);
            } else {
              setReport(report);
              setResults(results);
              setInsights(insights);
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch lab report data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReportData();
  }, [user, reportId]);
  
  const handleRefreshInsights = async () => {
    if (!report) return;
    
    setIsRefreshing(true);
    
    try {
      // Re-analyze the report to generate new insights
      const { analyzeLabResults } = await import("@/services/lab-reports");
      const { success, error } = await analyzeLabResults(report.id);
      
      if (success) {
        toast({
          title: "Analysis Updated",
          description: "Lab insights have been refreshed with the latest AI analysis"
        });
        
        // Refetch the data to get updated insights
        fetchReportData();
      } else {
        toast({
          title: "Analysis Failed",
          description: error || "Failed to update analysis",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-start mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <Loader className="h-8 w-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading lab report details...</p>
        </div>
      </div>
    );
  }
  
  if (!report || !results) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-start mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>No Lab Report Found</CardTitle>
            <CardDescription>
              {error || "No lab report data available"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50 mb-4" />
              <p className="mb-6">
                {error || "We couldn't find the lab report you're looking for."}
              </p>
              <Button onClick={() => navigate("/upload")}>
                Upload New Lab Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-muted-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Button 
          variant="outline" 
          disabled={isRefreshing}
          onClick={handleRefreshInsights}
          className="text-primary border-primary/30 hover:bg-primary hover:text-white"
        >
          <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Analysis"}
        </Button>
      </div>
      
      <LabResultsDisplay 
        report={report}
        results={results}
        insights={insights}
      />
    </div>
  );
};

export default LabDetailsPage;
