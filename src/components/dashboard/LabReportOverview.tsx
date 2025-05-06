
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LabReportOverview: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data - in a real app, this would come from API or state management
  const labCategories = [
    {
      name: "Critical Attention",
      count: 2,
      status: "critical",
      icon: <AlertCircle className="h-4 w-4" />,
      items: [
        { name: "Vitamin D", value: "20 ng/mL", status: "critical" },
        { name: "HDL Cholesterol", value: "38 mg/dL", status: "critical" },
      ]
    },
    {
      name: "Monitoring Needed",
      count: 3,
      status: "warning",
      icon: <AlertTriangle className="h-4 w-4" />,
      items: [
        { name: "Total Cholesterol", value: "210 mg/dL", status: "warning" },
        { name: "LDL Cholesterol", value: "132 mg/dL", status: "warning" },
        { name: "Triglycerides", value: "155 mg/dL", status: "warning" },
      ]
    },
    {
      name: "Optimal Range",
      count: 12,
      status: "normal",
      icon: <CheckCircle className="h-4 w-4" />,
      items: [
        { name: "Blood Glucose", value: "87 mg/dL", status: "normal" },
        { name: "Hemoglobin", value: "14.2 g/dL", status: "normal" },
        { name: "White Blood Cells", value: "6.8 K/uL", status: "normal" },
      ]
    },
  ];
  
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
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.value}</span>
                        <div
                          className={`w-2 h-2 rounded-full
                            ${item.status === "critical" ? "bg-destructive" : ""}
                            ${item.status === "warning" ? "bg-yellow-500" : ""}
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
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <span>Consider scheduling a doctor's visit to address vitamin D deficiency</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Explore our nutrition plan to help improve cholesterol levels</span>
                </li>
              </ul>
              <Button 
                className="mt-4 w-full"
                onClick={() => navigate("/action-plan")}
              >
                View Detailed Action Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LabReportOverview;
