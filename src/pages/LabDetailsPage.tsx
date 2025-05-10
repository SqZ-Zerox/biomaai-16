
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getLabReportDetails, getUserLabReports, LabInsight, LabReport, LabResult } from "@/services/labReportService";
import LabResultsDisplay from "@/components/lab-reports/LabResultsDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Loader } from "lucide-react";

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
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
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
            const latestReport = reports.find(r => r.status === "analyzed");
            
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
    
    fetchData();
  }, [user, reportId]);
  
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
      <div className="flex justify-start mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-muted-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
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
