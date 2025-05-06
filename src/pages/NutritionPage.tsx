
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Apple, ArrowLeft, ListCheck, Clock, AlertCircle, FileText } from "lucide-react";

const NutritionPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("plan");
  const hasLabReports = false; // This would come from your state management in a real app
  
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex flex-col gap-6">
        {/* Page header with back button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">AI Nutrition Plan</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-border/40 shadow-sm mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Apple className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle>Personalized Nutrition</CardTitle>
                  <CardDescription>
                    {hasLabReports 
                      ? "Custom meal plans based on your lab results" 
                      : "AI-powered recommendations based on your preferences"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Data confidence banner */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 flex gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-yellow-600 dark:text-yellow-400">Limited Personalization</h4>
                    <p className="text-xs text-muted-foreground">
                      Upload lab reports to get nutrition plans tailored to your specific health needs.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-xs h-7"
                      onClick={() => navigate('/upload')}
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      Upload Lab Reports
                    </Button>
                  </div>
                </div>
                
                <Tabs defaultValue="plan" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="plan">Meal Plan</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="grocery">Grocery List</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="plan" className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-primary" />
                          Breakfast
                        </h3>
                        <Badge variant="outline" className="bg-primary/5 text-primary">400-450 calories</Badge>
                      </div>
                      
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Greek yogurt with berries and honey</span>
                          <span className="text-muted-foreground">250 cal</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Whole grain toast with avocado</span>
                          <span className="text-muted-foreground">180 cal</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Green tea (unsweetened)</span>
                          <span className="text-muted-foreground">0 cal</span>
                        </li>
                      </ul>
                      
                      <div className="mt-3 text-xs text-primary">
                        <p className="font-medium">Key nutrients:</p>
                        <p>Protein: 15g | Fiber: 8g | Calcium: 200mg | Vitamin C: 30mg</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-primary" />
                          Lunch
                        </h3>
                        <Badge variant="outline" className="bg-primary/5 text-primary">500-550 calories</Badge>
                      </div>
                      
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Grilled chicken salad with olive oil dressing</span>
                          <span className="text-muted-foreground">320 cal</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Quinoa (1/2 cup)</span>
                          <span className="text-muted-foreground">120 cal</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Apple</span>
                          <span className="text-muted-foreground">95 cal</span>
                        </li>
                      </ul>
                      
                      <div className="mt-3 text-xs text-primary">
                        <p className="font-medium">Key nutrients:</p>
                        <p>Protein: 28g | Fiber: 12g | Iron: 4mg | Vitamin A: 500μg</p>
                      </div>
                    </div>
                    
                    <Button className="w-full" onClick={() => setActiveTab("grocery")}>
                      <ListCheck className="mr-2 h-4 w-4" />
                      Generate Grocery List
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="preferences" className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Dietary Preferences</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-start">Vegetarian</Button>
                        <Button variant="outline" className="justify-start text-primary bg-primary/5 border-primary/30">Mediterranean</Button>
                        <Button variant="outline" className="justify-start">Low Carb</Button>
                        <Button variant="outline" className="justify-start">High Protein</Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Allergies & Restrictions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-start">Gluten</Button>
                        <Button variant="outline" className="justify-start text-destructive bg-destructive/5 border-destructive/30">Nuts</Button>
                        <Button variant="outline" className="justify-start">Dairy</Button>
                        <Button variant="outline" className="justify-start">Shellfish</Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Calorie Target</h3>
                      <Input type="range" min="1200" max="3000" step="50" defaultValue="2000" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1200 cal</span>
                        <span>2000 cal</span>
                        <span>3000 cal</span>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Update Nutrition Plan
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="grocery" className="space-y-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Produce</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input type="checkbox" id="item-1" className="mr-2" />
                              <Label htmlFor="item-1">Berries (mixed, 1 cup)</Label>
                            </div>
                            <span className="text-xs text-muted-foreground">Vitamin C, antioxidants</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input type="checkbox" id="item-2" className="mr-2" />
                              <Label htmlFor="item-2">Avocado (2)</Label>
                            </div>
                            <span className="text-xs text-muted-foreground">Healthy fats, fiber</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input type="checkbox" id="item-3" className="mr-2" />
                              <Label htmlFor="item-3">Mixed salad greens (1 bag)</Label>
                            </div>
                            <span className="text-xs text-muted-foreground">Vitamin K, folate</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Protein</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input type="checkbox" id="item-4" className="mr-2" />
                              <Label htmlFor="item-4">Chicken breast (1 lb)</Label>
                            </div>
                            <span className="text-xs text-muted-foreground">Lean protein</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input type="checkbox" id="item-5" className="mr-2" />
                              <Label htmlFor="item-5">Greek yogurt (32 oz)</Label>
                            </div>
                            <span className="text-xs text-muted-foreground">Protein, probiotics</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Grains</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input type="checkbox" id="item-6" className="mr-2" />
                              <Label htmlFor="item-6">Whole grain bread (1 loaf)</Label>
                            </div>
                            <span className="text-xs text-muted-foreground">Complex carbs, fiber</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input type="checkbox" id="item-7" className="mr-2" />
                              <Label htmlFor="item-7">Quinoa (1 bag)</Label>
                            </div>
                            <span className="text-xs text-muted-foreground">Complete protein, fiber</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        Export List
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Share List
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-4">
              {hasLabReports ? (
                <p className="text-xs text-center text-muted-foreground w-full">
                  This plan is optimized based on your lab results from May 2, 2025
                </p>
              ) : (
                <p className="text-xs text-center text-muted-foreground w-full">
                  For more personalized nutrition advice based on your specific health data, please upload your lab reports
                </p>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NutritionPage;
