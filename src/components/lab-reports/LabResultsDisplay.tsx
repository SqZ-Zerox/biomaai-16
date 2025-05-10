
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { LabInsight, LabResult, LabReport } from "@/services/lab-reports";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, AlertTriangle, Clock, Info, LineChart, ArrowUp, ArrowDown, Dumbbell, Apple, BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

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
  const [activeTab, setActiveTab] = useState<string>("results");
  
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
  
  // Prepare data for the chart
  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: 
      status === 'critical' ? '#f43f5e' : 
      status === 'high' ? '#f97316' :
      status === 'low' ? '#eab308' : 
      '#22c55e',
  }));
  
  // Get biomarker information (would normally come from an API/database)
  const getBiomarkerInfo = (name: string) => {
    const biomarkerInfo: Record<string, { description: string, impact: string }> = {
      "Glucose": {
        description: "A simple sugar that is your body's main source of energy.",
        impact: "High levels may indicate diabetes, low levels can cause fatigue and dizziness."
      },
      "Cholesterol": {
        description: "A waxy substance found in your blood and all cells of the body.",
        impact: "High levels can increase the risk of heart disease and stroke."
      },
      "HDL": {
        description: "'Good' cholesterol that helps remove other forms of cholesterol from your bloodstream.",
        impact: "Higher levels are generally better for heart health."
      },
      "LDL": {
        description: "'Bad' cholesterol that can build up in your arteries.",
        impact: "High levels increase your risk of heart disease."
      },
      "Triglycerides": {
        description: "A type of fat found in your blood.",
        impact: "High levels may increase risk of heart disease and stroke."
      },
      "A1C": {
        description: "Shows your average blood sugar levels over the past 2-3 months.",
        impact: "Elevated levels indicate poor blood sugar control and risk of diabetes."
      },
      "Vitamin D": {
        description: "Important for bone health and immune function.",
        impact: "Low levels can lead to bone loss and increased risk of fractures."
      },
      "Iron": {
        description: "Helps your body produce red blood cells.",
        impact: "Low levels can lead to anemia and fatigue."
      },
      "TSH": {
        description: "Controls how much thyroid hormone your body makes.",
        impact: "High levels may indicate an underactive thyroid (hypothyroidism)."
      }
    };
    
    return biomarkerInfo[name] || { description: "No information available.", impact: "Consult your healthcare provider for details." };
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
        
        <Tabs defaultValue="results" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="results" className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4" />
                Results
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex gap-2 items-center">
                <AlertCircle className="h-4 w-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex gap-2 items-center">
                <Dumbbell className="h-4 w-4" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="education" className="flex gap-2 items-center">
                <BookOpen className="h-4 w-4" />
                Learn
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-6">
            <TabsContent value="results" className="mt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                
                <div className="h-[200px] mb-6">
                  <h4 className="font-semibold mb-2">Results Overview</h4>
                  <ChartContainer
                    config={{
                      normal: { color: "#22c55e" },
                      high: { color: "#f97316" },
                      low: { color: "#eab308" },
                      critical: { color: "#f43f5e" },
                    }}
                    className="h-[150px]"
                  >
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="value"
                        radius={4}
                        fill="var(--color-normal)"
                        className="fill-primary"
                        name="Count"
                        isAnimationActive={true}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="font-semibold text-lg mb-4">Detailed Results</h3>
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    {Object.entries(groupedResults).map(([category, categoryResults]) => (
                      <div key={category}>
                        <h4 className="font-medium mb-2 text-muted-foreground">{category}</h4>
                        <div className="space-y-2">
                          {categoryResults.map((result) => (
                            <TooltipProvider key={result.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`p-3 rounded-md flex justify-between items-center cursor-help ${
                                      result.status === 'critical' ? 'bg-destructive/10' :
                                      result.status === 'high' || result.status === 'low' ? 'bg-yellow-500/10' :
                                      'bg-muted/50'
                                    }`}
                                  >
                                    <div>
                                      <div className="font-medium text-sm flex items-center gap-1">
                                        {result.biomarker_name}
                                        {result.status !== 'normal' && (
                                          <span>
                                            {result.status === 'high' && <ArrowUp className="h-3 w-3 text-orange-500" />}
                                            {result.status === 'low' && <ArrowDown className="h-3 w-3 text-yellow-500" />}
                                            {result.status === 'critical' && <AlertCircle className="h-3 w-3 text-destructive" />}
                                          </span>
                                        )}
                                      </div>
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
                                </TooltipTrigger>
                                <TooltipContent className="max-w-sm">
                                  <div className="space-y-2 p-1">
                                    <h5 className="font-semibold">{result.biomarker_name}</h5>
                                    <p className="text-sm">{getBiomarkerInfo(result.biomarker_name).description}</p>
                                    <div className="pt-1 border-t border-border/40">
                                      <p className="text-sm font-medium">Health Impact:</p>
                                      <p className="text-sm">{getBiomarkerInfo(result.biomarker_name).impact}</p>
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="mt-0">
              {insights && insights.insights.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                      Key Insights
                    </h3>
                    <ul className="space-y-3">
                      {insights.insights.map((insight, idx) => (
                        <motion.li 
                          key={idx} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-muted/50 p-4 rounded-md text-sm"
                        >
                          {insight}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  {insights.warnings.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                        Warnings
                      </h3>
                      <ul className="space-y-3">
                        {insights.warnings.map((warning, idx) => (
                          <motion.li 
                            key={idx} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-destructive/10 p-4 rounded-md text-sm border border-destructive/30"
                          >
                            {warning}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Info className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't generate insights for this report. This may happen if the report is still being processed or if there was an error during analysis.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-0">
              <div className="space-y-6">
                {insights && insights.recommendations.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {insights.recommendations.map((recommendation, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-green-500/10 p-4 rounded-md text-sm border border-green-500/30"
                        >
                          <div className="flex space-x-3">
                            <div className="mt-0.5">
                              {idx % 3 === 0 && <Apple className="h-4 w-4 text-green-500" />}
                              {idx % 3 === 1 && <Dumbbell className="h-4 w-4 text-green-500" />}
                              {idx % 3 === 2 && <Clock className="h-4 w-4 text-green-500" />}
                            </div>
                            <div>{recommendation}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Info className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Recommendations Available</h3>
                    <p className="text-muted-foreground max-w-md">
                      We couldn't generate recommendations for this report. This may happen if the report is still being processed or if there was an error during analysis.
                    </p>
                  </div>
                )}
                
                {insights && insights.follow_ups.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      Follow-up Tests
                    </h3>
                    <ul className="space-y-3">
                      {insights.follow_ups.map((followUp, idx) => (
                        <motion.li 
                          key={idx} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-blue-500/10 p-4 rounded-md text-sm border border-blue-500/30"
                        >
                          {followUp}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="education" className="mt-0">
              <div className="space-y-6">
                <h3 className="font-semibold text-lg mb-3">Understanding Your Lab Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">What Do These Results Mean?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Lab tests measure different substances in your blood, urine, or other samples. Results outside of reference ranges may indicate potential health issues, but a single abnormal result doesn't always mean a medical problem exists.</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">How to Interpret Status Labels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span><strong>Normal:</strong> Within the expected healthy range</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span><strong>High/Low:</strong> Outside normal range but not severely</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-destructive" />
                          <span><strong>Critical:</strong> Significantly outside normal range</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base">Common Categories Explained</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium mb-1">Lipids</h4>
                          <p>Fats in your blood including cholesterol and triglycerides. Important for heart health assessment.</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Metabolic</h4>
                          <p>Measures substances related to your metabolism including glucose, electrolytes, and kidney function.</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">CBC (Complete Blood Count)</h4>
                          <p>Evaluates your blood cells (red, white, and platelets) to detect infections, anemia, and other conditions.</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Hormones</h4>
                          <p>Chemical messengers that regulate bodily functions including thyroid, reproductive, and stress hormones.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="rounded-md bg-muted/50 p-4 text-sm">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" />
                    Important Note
                  </h4>
                  <p>Always consult with your healthcare provider before making any health decisions based on these results. This analysis is meant to provide information and education, not to replace professional medical advice.</p>
                </div>
              </div>
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t pt-6">
            <div className="text-sm text-muted-foreground">
              <p>Analysis performed by AI assistant based on your lab results</p>
            </div>
            <Button onClick={() => window.print()} variant="outline">
              Print Report
            </Button>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default LabResultsDisplay;
