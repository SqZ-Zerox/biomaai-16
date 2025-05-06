
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, ArrowLeft, AlertCircle, FileText, Heart, Clock } from "lucide-react";

const FitnessPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("routines");
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
          <h1 className="text-2xl md:text-3xl font-bold">Fitness Routine Builder</h1>
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
                  <Dumbbell className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle>Adaptive Fitness</CardTitle>
                  <CardDescription>
                    {hasLabReports 
                      ? "Workouts optimized for your health profile" 
                      : "AI-powered routines based on your goals"}
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
                      Upload lab reports to get workouts tailored to your specific health conditions.
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
                
                {/* Goals and fitness level */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium">Fitness Goal</label>
                    <Select defaultValue="strength">
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strength">Build Strength</SelectItem>
                        <SelectItem value="cardio">Improve Cardiovascular Health</SelectItem>
                        <SelectItem value="flexibility">Increase Flexibility</SelectItem>
                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium">Fitness Level</label>
                    <Select defaultValue="intermediate">
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Tabs defaultValue="routines" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="routines">Routines</TabsTrigger>
                    <TabsTrigger value="equipment">Equipment</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="routines" className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold flex items-center">
                          <Heart className="mr-2 h-4 w-4 text-primary" />
                          Strength & Conditioning
                        </h3>
                        <Badge variant="outline" className="bg-primary/5 text-primary">40 minutes</Badge>
                      </div>
                      
                      <ul className="space-y-3 text-sm">
                        <li className="flex justify-between">
                          <div>
                            <span className="font-medium">Warm-up</span>
                            <p className="text-xs text-muted-foreground">Dynamic stretching, light cardio</p>
                          </div>
                          <span className="text-muted-foreground">5 min</span>
                        </li>
                        <li className="flex justify-between">
                          <div>
                            <span className="font-medium">Dumbbell Squats</span>
                            <p className="text-xs text-muted-foreground">3 sets x 12 reps</p>
                          </div>
                          <span className="text-muted-foreground">10 min</span>
                        </li>
                        <li className="flex justify-between">
                          <div>
                            <span className="font-medium">Push-ups</span>
                            <p className="text-xs text-muted-foreground">3 sets x 10 reps</p>
                          </div>
                          <span className="text-muted-foreground">8 min</span>
                        </li>
                        <li className="flex justify-between">
                          <div>
                            <span className="font-medium">Dumbbell Rows</span>
                            <p className="text-xs text-muted-foreground">3 sets x 12 reps each side</p>
                          </div>
                          <span className="text-muted-foreground">10 min</span>
                        </li>
                        <li className="flex justify-between">
                          <div>
                            <span className="font-medium">Cool Down</span>
                            <p className="text-xs text-muted-foreground">Static stretching</p>
                          </div>
                          <span className="text-muted-foreground">7 min</span>
                        </li>
                      </ul>
                      
                      <div className="mt-3 text-xs text-primary">
                        <p className="font-medium">Focus areas:</p>
                        <p>Major muscle groups, core stability, functional strength</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-primary" />
                          Cardio Session
                        </h3>
                        <Badge variant="outline" className="bg-primary/5 text-primary">30 minutes</Badge>
                      </div>
                      
                      <ul className="space-y-3 text-sm">
                        <li className="flex justify-between">
                          <div>
                            <span className="font-medium">Warm-up</span>
                            <p className="text-xs text-muted-foreground">Light jog or brisk walk</p>
                          </div>
                          <span className="text-muted-foreground">5 min</span>
                        </li>
                        <li className="flex justify-between">
                          <div>
                            <span className="font-medium">Interval Training</span>
                            <p className="text-xs text-muted-foreground">30s high intensity, 30s rest x 10</p>
                          </div>
                          <span className="text-muted-foreground">10 min</span>
                        </li>
                        <li className="flex justify-between">
                          <div>
                            <span className="font-medium">Steady State Cardio</span>
                            <p className="text-xs text-muted-foreground">Moderate intensity</p>
                          </div>
                          <span className="text-muted-foreground">10 min</span>
                        </li>
                        <li className="flex justify-between">
                          <div>
                            <span className="font-medium">Cool Down</span>
                            <p className="text-xs text-muted-foreground">Light pace, stretching</p>
                          </div>
                          <span className="text-muted-foreground">5 min</span>
                        </li>
                      </ul>
                      
                      <div className="mt-3 text-xs text-primary">
                        <p className="font-medium">Focus areas:</p>
                        <p>Cardiovascular endurance, metabolic health, recovery</p>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Generate Custom Workout Plan
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="equipment" className="space-y-4">
                    <div className="space-y-4">
                      <div className="bg-muted/30 p-4 rounded-md">
                        <h3 className="font-medium mb-3">Available Equipment</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="justify-start text-primary bg-primary/5 border-primary/30">Dumbbells</Button>
                          <Button variant="outline" className="justify-start">Barbell</Button>
                          <Button variant="outline" className="justify-start text-primary bg-primary/5 border-primary/30">Resistance Bands</Button>
                          <Button variant="outline" className="justify-start">Pull-up Bar</Button>
                          <Button variant="outline" className="justify-start text-primary bg-primary/5 border-primary/30">Yoga Mat</Button>
                          <Button variant="outline" className="justify-start">Kettlebell</Button>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-md">
                        <h3 className="font-medium mb-3">Workout Environment</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="justify-start text-primary bg-primary/5 border-primary/30">Home</Button>
                          <Button variant="outline" className="justify-start">Gym</Button>
                          <Button variant="outline" className="justify-start">Outdoors</Button>
                          <Button variant="outline" className="justify-start">Hotel Room</Button>
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        Update Workout Equipment
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="progress" className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-md text-center pt-12 pb-12">
                      <Dumbbell className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Track Your Progress</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Complete workouts to see your progress and track improvements over time
                      </p>
                      <Button variant="outline">
                        Start Tracking Today
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-4">
              {hasLabReports ? (
                <p className="text-xs text-center text-muted-foreground w-full">
                  This fitness plan is adapted to your health profile from your latest lab results
                </p>
              ) : (
                <p className="text-xs text-center text-muted-foreground w-full">
                  For workouts customized to your health conditions, limitations, and goals, please upload your lab reports
                </p>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FitnessPage;
