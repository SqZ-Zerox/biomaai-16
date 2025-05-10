
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LabInsight, LabResult, LabReport } from "@/services/labReportService";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LabResultsDisplayProps {
  report: LabReport;
  results: LabResult[];
  insights: LabInsight | null;
}

const LabResultsDisplay: React.FC<LabResultsDisplayProps> = ({
  report,
  results,
  insights
}) => {
  // Group results by category and status
  const groupedResults = results.reduce((groups: Record<string, LabResult[]>, result) => {
    const category = result.category || 'Other';
    
    if (!groups[category]) {
      groups[category] = [];
    }
    
    groups[category].push(result);
    return groups;
  }, {});
  
  // Count results by status
  const statusCounts = results.reduce((counts: Record<string, number>, result) => {
    const status = result.status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle>Lab Report Analysis</CardTitle>
            <Badge variant="outline" className="text-xs">
              {formatDate(report.upload_date)}
            </Badge>
          </div>
          <CardDescription>
            {report.test_types?.join(', ')} - {report.file_name}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-destructive/10 border-destructive/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold">{statusCounts.critical || 0}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive opacity-80" />
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Borderline</p>
                  <p className="text-2xl font-bold">{(statusCounts.low || 0) + (statusCounts.high || 0)}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500 opacity-80" />
              </CardContent>
            </Card>
            
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Normal</p>
                  <p className="text-2xl font-bold">{statusCounts.normal || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500 opacity-80" />
              </CardContent>
            </Card>
          </div>
          
          {insights && (
            <div className="space-y-6 mb-6">
              {insights.insights.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                    Key Insights
                  </h3>
                  <ul className="space-y-2">
                    {insights.insights.map((insight, idx) => (
                      <li key={idx} className="bg-muted/50 p-3 rounded-md text-sm">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {insights.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {insights.recommendations.map((recommendation, idx) => (
                      <li key={idx} className="bg-green-500/10 p-3 rounded-md text-sm">
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {insights.warnings.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                    Warnings
                  </h3>
                  <ul className="space-y-2">
                    {insights.warnings.map((warning, idx) => (
                      <li key={idx} className="bg-destructive/10 p-3 rounded-md text-sm">
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {insights.follow_ups.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    Follow-up Tests
                  </h3>
                  <ul className="space-y-2">
                    {insights.follow_ups.map((followUp, idx) => (
                      <li key={idx} className="bg-blue-500/10 p-3 rounded-md text-sm">
                        {followUp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <h3 className="font-semibold text-lg mb-4">Detailed Results</h3>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {Object.entries(groupedResults).map(([category, categoryResults]) => (
                <div key={category}>
                  <h4 className="font-medium mb-2 text-muted-foreground">{category}</h4>
                  <div className="space-y-2">
                    {categoryResults.map((result) => (
                      <div
                        key={result.id}
                        className={`p-3 rounded-md flex justify-between items-center ${
                          result.status === 'critical' ? 'bg-destructive/10' :
                          result.status === 'high' || result.status === 'low' ? 'bg-yellow-500/10' :
                          'bg-muted/50'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-sm">{result.biomarker_name}</div>
                          <div className="text-xs text-muted-foreground">
                            Reference: {result.reference_range || "Not provided"}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold">{result.value}{result.unit ? ` ${result.unit}` : ''}</div>
                            <div className="text-xs capitalize text-muted-foreground">
                              {result.status}
                            </div>
                          </div>
                          
                          <div className={`w-3 h-3 rounded-full ${
                            result.status === 'critical' ? 'bg-destructive' :
                            result.status === 'high' || result.status === 'low' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabResultsDisplay;
