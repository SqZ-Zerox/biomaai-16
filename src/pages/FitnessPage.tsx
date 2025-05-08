import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Dumbbell, 
  ArrowLeft, 
  AlertCircle, 
  FileText, 
  Heart, 
  Clock, 
  CheckCircle2,
  Loader2,
  ArrowRight
} from "lucide-react";
import { generateFitnessPlan, FitnessPlan } from "@/services/fitnessPlanService";

// Screen states for the fitness plan flow
type FitnessScreenState = 
  | "initial" 
  | "loading" 
  | "questions" 
  | "summary" 
  | "plan";

// Equipment options
const equipmentOptions = [
  { value: "none", label: "None" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "bands", label: "Resistance Bands" },
  { value: "gym", label: "Full Gym" }
];

// Fitness goals options
const fitnessGoals = [
  { value: "weight-loss", label: "Weight Loss" },
  { value: "muscle", label: "Build Muscle" },
  { value: "endurance", label: "Endurance" },
  { value: "flexibility", label: "Flexibility" }
];

const FitnessPage: React.FC = () => {
  const navigate = useNavigate();
  const [screenState, setScreenState] = useState<FitnessScreenState>("initial");
  const [activeTab, setActiveTab] = useState("routines");
  
  // User selections
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [minutesPerDay, setMinutesPerDay] = useState<number>(30);
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [generatedPlan, setGeneratedPlan] = useState<FitnessPlan | null>(null);

  // Handle equipment selection
  const toggleEquipment = (value: string) => {
    if (selectedEquipment.includes(value)) {
      setSelectedEquipment(selectedEquipment.filter(item => item !== value));
    } else {
      setSelectedEquipment([...selectedEquipment, value]);
    }
  };

  // Handle goal selection
  const selectGoal = (value: string) => {
    setSelectedGoal(value);
  };

  // Start the fitness plan flow
  const startFitnessPlan = () => {
    setScreenState("loading");
    
    // Simulate AI analysis progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setScreenState("questions");
        }, 500);
      }
      setAnalysisProgress(progress);
    }, 700);
  };

  // Handle submission of lifestyle questions
  const submitLifestyleQuestions = () => {
    setScreenState("summary");
  };

  // Generate the final plan using Gemini
  const generateFinalPlan = async () => {
    // Show loading screen briefly
    setScreenState("loading");
    setAnalysisProgress(0);
    
    // Simulate progress while we generate the plan
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setAnalysisProgress(progress);
    }, 500);
    
    // Use our fitness plan service to generate a plan
    const plan = await generateFitnessPlan({
      goal: fitnessGoals.find(g => g.value === selectedGoal)?.label || selectedGoal,
      equipment: selectedEquipment,
      minutesPerDay,
      healthData: {
        bmi: 24.5,
        heartRate: 68,
        activityLevel: "Moderately active"
      }
    });
    
    setGeneratedPlan(plan);
    
    // Stop the interval and move to the plan screen
    clearInterval(interval);
    setScreenState("plan");
  };

  // Go back to the previous screen
  const goBack = () => {
    if (screenState === "loading") {
      setScreenState("initial");
    } else if (screenState === "questions") {
      setScreenState("initial");
    } else if (screenState === "summary") {
      setScreenState("questions");
    } else if (screenState === "plan") {
      setScreenState("summary");
    } else {
      navigate(-1);
    }
  };

  // Variants for animations
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex flex-col gap-6">
        {/* Page header with back button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goBack}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">
            {screenState === "initial" && "Fitness Routine Builder"}
            {screenState === "loading" && "Analyzing Health Data"}
            {screenState === "questions" && "Lifestyle Questions"}
            {screenState === "summary" && "Summary & Review"}
            {screenState === "plan" && "Your Fitness Plan"}
          </h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>
        
        <AnimatePresence mode="wait">
          {/* Initial Screen */}
          {screenState === "initial" && (
            <motion.div
              key="initial"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Card className="border-border/40 shadow-lg mb-6 overflow-hidden">
                <div className="bg-gradient-to-br from-primary/5 to-primary/20 pt-16 pb-16 px-6 text-center">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto mb-6 bg-primary/10 p-5 rounded-full w-24 h-24 flex items-center justify-center"
                  >
                    <Dumbbell className="h-12 w-12 text-primary" />
                  </motion.div>
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-3xl font-bold mb-2"
                  >
                    Ready to Transform?
                  </motion.h2>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-muted-foreground text-lg max-w-xl mx-auto"
                  >
                    AI will analyze your test reports and lifestyle to build a plan just for you.
                  </motion.p>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-8"
                  >
                    <Button 
                      size="lg" 
                      className="text-lg px-8 py-6"
                      onClick={startFitnessPlan}
                    >
                      Generate My Fitness Plan
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
                
                <CardContent className="pt-6">
                  {/* Data confidence banner */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4 flex gap-3 mb-4">
                    <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-yellow-600 dark:text-yellow-400">Enhanced with Lab Results</h4>
                      <p className="text-sm text-muted-foreground">
                        Upload lab reports to get workouts tailored to your specific health conditions.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 text-sm"
                        onClick={() => navigate('/upload')}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Upload Lab Reports
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t pt-4 pb-4 text-center">
                  <p className="text-sm text-muted-foreground w-full">
                    This plan is designed to enhance your wellness journey based on available data. It is not a medical substitute.
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          
          {/* Loading Screen - AI Analysis */}
          {screenState === "loading" && (
            <motion.div
              key="loading"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Card className="border-border/40 shadow-lg mb-6 overflow-hidden">
                <div className="bg-gradient-to-br from-primary/5 to-primary/20 pt-16 pb-16 px-6 text-center">
                  <motion.div 
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear"
                    }}
                    className="mx-auto mb-6 bg-primary/10 p-5 rounded-full w-24 h-24 flex items-center justify-center"
                  >
                    <Loader2 className="h-12 w-12 text-primary" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold mb-6">
                    Analyzing your lab tests, genetics & lifestyle data...
                  </h2>
                  
                  {/* Progress stages */}
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between mb-2 text-sm">
                      <span className={`${analysisProgress >= 33 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {analysisProgress >= 33 ? '✓ ' : ''}Scanning reports
                      </span>
                      <span className={`${analysisProgress >= 66 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {analysisProgress >= 66 ? '✓ ' : ''}Understanding lifestyle
                      </span>
                      <span className={`${analysisProgress >= 100 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {analysisProgress >= 100 ? '✓ ' : ''}Generating plan
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-muted/50 rounded-full h-2.5 mb-6">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${Math.min(analysisProgress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground animate-pulse">
                    This may take a moment...
                  </p>
                </div>
                
                <CardFooter className="border-t pt-4 pb-4 text-center">
                  <p className="text-sm text-muted-foreground w-full">
                    We're creating a personalized fitness plan tailored to your unique profile
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          
          {/* Lifestyle Questions Screen */}
          {screenState === "questions" && (
            <motion.div
              key="questions"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Card className="border-border/40 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle>Tell Us About Your Preferences</CardTitle>
                  <CardDescription>
                    These details will help us customize your fitness plan
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  {/* Equipment Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">What equipment do you have access to?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {equipmentOptions.map(option => (
                        <Button
                          key={option.value}
                          variant={selectedEquipment.includes(option.value) ? "default" : "outline"}
                          className={`justify-start h-auto py-3 ${
                            selectedEquipment.includes(option.value) 
                              ? 'bg-primary text-primary-foreground' 
                              : ''
                          }`}
                          onClick={() => toggleEquipment(option.value)}
                        >
                          {selectedEquipment.includes(option.value) && (
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                          )}
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Time Commitment Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">How many minutes can you dedicate per day?</h3>
                    <div className="space-y-4 px-1">
                      <Slider
                        value={[minutesPerDay]}
                        min={10}
                        max={90}
                        step={5}
                        onValueChange={(value) => setMinutesPerDay(value[0])}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>10 min</span>
                        <span className="font-medium text-primary">{minutesPerDay} minutes</span>
                        <span>90 min</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fitness Goals Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">What is your primary fitness goal?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {fitnessGoals.map(goal => (
                        <Button
                          key={goal.value}
                          variant={selectedGoal === goal.value ? "default" : "outline"}
                          className={`justify-start h-auto py-3 ${
                            selectedGoal === goal.value 
                              ? 'bg-primary text-primary-foreground' 
                              : ''
                          }`}
                          onClick={() => selectGoal(goal.value)}
                        >
                          {selectedGoal === goal.value && (
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                          )}
                          {goal.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex-col border-t pt-4 space-y-3">
                  <Button 
                    className="w-full"
                    disabled={selectedEquipment.length === 0 || !selectedGoal} 
                    onClick={submitLifestyleQuestions}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    All information can be updated later from your profile settings
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          
          {/* AI Summary Screen */}
          {screenState === "summary" && (
            <motion.div
              key="summary"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Card className="border-border/40 shadow-lg mb-6">
                <CardHeader className="border-b">
                  <CardTitle>AI Fitness Plan Summary</CardTitle>
                  <CardDescription>
                    Review your information before we generate your plan
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6 space-y-6">
                  {/* Summary sections */}
                  <div className="space-y-4">
                    <div className="bg-muted/40 p-4 rounded-md">
                      <h3 className="text-lg font-semibold flex items-center mb-2">
                        <Heart className="mr-2 h-5 w-5 text-primary" />
                        Your Health Profile
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">BMI</span>
                          <span className="font-medium">24.5 (Normal)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Resting heart rate</span>
                          <span className="font-medium">68 bpm</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Activity level</span>
                          <span className="font-medium">Moderately active</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted/40 p-4 rounded-md">
                      <h3 className="text-lg font-semibold flex items-center mb-2">
                        <Dumbbell className="mr-2 h-5 w-5 text-primary" />
                        Your Preferences
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Equipment</span>
                          <div className="flex gap-1 flex-wrap justify-end">
                            {selectedEquipment.map(eq => (
                              <Badge key={eq} variant="outline" className="bg-primary/10">
                                {equipmentOptions.find(o => o.value === eq)?.label || eq}
                              </Badge>
                            ))}
                          </div>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Time per day</span>
                          <span className="font-medium">{minutesPerDay} minutes</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Primary goal</span>
                          <Badge variant="default">
                            {fitnessGoals.find(g => g.value === selectedGoal)?.label || selectedGoal}
                          </Badge>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted/40 p-4 rounded-md">
                      <h3 className="text-lg font-semibold flex items-center mb-2">
                        <Clock className="mr-2 h-5 w-5 text-primary" />
                        Fitness Plan Focus
                      </h3>
                      <p className="text-sm">
                        Based on your preferences and health data, your plan will focus on:
                      </p>
                      <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                        <li>Progressive resistance training optimized for your health condition</li>
                        <li>Appropriate intensity levels based on your cardiovascular health</li>
                        <li>Exercises that align with your {fitnessGoals.find(g => g.value === selectedGoal)?.label.toLowerCase() || selectedGoal} goal</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Disclaimer */}
                  <div className="bg-background/50 border border-border rounded-md p-4 text-sm text-muted-foreground">
                    <p className="flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        This plan is designed to enhance your wellness journey based on available data. It is not a medical substitute. Please consult a professional if needed.
                      </span>
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex-col border-t pt-4 space-y-3">
                  <Button 
                    className="w-full"
                    onClick={generateFinalPlan}
                  >
                    Confirm & Generate Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          
          {/* Generated Plan Screen - Now using AI-generated data */}
          {screenState === "plan" && (
            <motion.div
              key="plan"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Card className="border-border/40 shadow-lg mb-6">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Dumbbell className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Your Personalized Fitness Plan</CardTitle>
                      <CardDescription>
                        Tailored to your goals, equipment, and health profile
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <Tabs defaultValue="routines" onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="routines">Routines</TabsTrigger>
                        <TabsTrigger value="equipment">Equipment</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="routines" className="space-y-4">
                        {generatedPlan && generatedPlan.workouts ? (
                          // Use AI-generated plan
                          <>
                            {generatedPlan.workouts.map((workout, index) => (
                              <div key={index} className="bg-muted/30 p-4 rounded-md">
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="font-semibold flex items-center">
                                    {index === 0 ? (
                                      <Heart className="mr-2 h-4 w-4 text-primary" />
                                    ) : (
                                      <Clock className="mr-2 h-4 w-4 text-primary" />
                                    )}
                                    {workout.title}
                                  </h3>
                                  <Badge variant="outline" className="bg-primary/5 text-primary">
                                    {workout.duration}
                                  </Badge>
                                </div>
                                
                                <ul className="space-y-3 text-sm">
                                  {workout.exercises.map((exercise, eIndex) => (
                                    <li key={eIndex} className="flex justify-between">
                                      <div>
                                        <span className="font-medium">{exercise.name}</span>
                                        <p className="text-xs text-muted-foreground">{exercise.description}</p>
                                      </div>
                                      <span className="text-muted-foreground">
                                        {exercise.sets && exercise.reps ? 
                                          `${exercise.sets} sets × ${exercise.reps} reps` : 
                                          exercise.duration}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                
                                <div className="mt-3 text-xs text-primary">
                                  <p className="font-medium">Focus areas:</p>
                                  <p>{workout.focusAreas.join(', ')}</p>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          // Fallback content
                          <div className="bg-muted/30 p-4 rounded-md text-center py-8">
                            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <h3 className="font-medium mb-1">Plan Generation Issue</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              We couldn't generate your custom plan. Please try again.
                            </p>
                            <Button variant="outline" onClick={() => setScreenState("questions")}>
                              Retry
                            </Button>
                          </div>
                        )}
                        
                        <Button className="w-full">
                          Download Plan as PDF
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="equipment" className="space-y-4">
                        <div className="space-y-4">
                          <div className="bg-muted/30 p-4 rounded-md">
                            <h3 className="font-medium mb-3">Selected Equipment</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedEquipment.map(eq => (
                                <Button 
                                  key={eq} 
                                  variant="outline" 
                                  className="justify-start text-primary bg-primary/5 border-primary/30"
                                >
                                  {equipmentOptions.find(o => o.value === eq)?.label || eq}
                                </Button>
                              ))}
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
                
                <CardFooter className="border-t pt-4 text-center">
                  <div className="w-full">
                    <p className="text-sm text-muted-foreground mb-2">
                      This fitness plan is customized based on your preferences and health profile
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setScreenState("questions")}>
                      Adjust Your Preferences
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FitnessPage;
