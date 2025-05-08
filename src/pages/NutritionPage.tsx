
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Apple, ArrowLeft, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import refactored components
import ProgressStepper from "@/components/nutrition/ProgressStepper";
import NutritionForm from "@/components/nutrition/NutritionForm";
import MealPlanDisplay from "@/components/nutrition/MealPlanDisplay";
import { MealPreferences } from "@/components/nutrition/types";
import { goals, dietaryOptions, restrictionOptions, sampleMealPlan } from "@/components/nutrition/data";

const NutritionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [planGenerated, setPlanGenerated] = useState<boolean>(false);
  
  // Step 1: Goal selection
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  
  // Step 2: Dietary preferences
  const [dietType, setDietType] = useState<string>("balanced");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  
  // Step 3: Meal preferences
  const [mealCount, setMealCount] = useState<number>(3);
  const [calorieTarget, setCalorieTarget] = useState<number>(2000);
  const [mealPreferences, setMealPreferences] = useState<MealPreferences>({
    breakfast: true,
    lunch: true,
    dinner: true,
    snacks: false,
  });
  
  // Meal plan data
  const [currentDay, setCurrentDay] = useState<number>(1);
  
  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
  };
  
  const handleRestrictionToggle = (restriction: string) => {
    if (restrictions.includes(restriction)) {
      setRestrictions(restrictions.filter(r => r !== restriction));
    } else {
      setRestrictions([...restrictions, restriction]);
    }
  };
  
  const handleMealPreferenceToggle = (meal: keyof typeof mealPreferences) => {
    setMealPreferences({
      ...mealPreferences,
      [meal]: !mealPreferences[meal]
    });
  };
  
  const handleNext = () => {
    // Validate current step
    if (step === 1 && !selectedGoal) {
      toast({
        title: "Please select a goal",
        description: "You need to select a nutrition goal to continue",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 3) {
      // Generate plan
      generatePlan();
      return;
    }
    
    setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/dashboard");
    }
  };
  
  const generatePlan = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPlanGenerated(true);
      toast({
        title: "Nutrition plan created!",
        description: "Your personalized nutrition plan is ready",
      });
    }, 2000);
  };

  if (planGenerated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Apple className="mr-2 h-6 w-6 text-primary" />
                Your Nutrition Plan
              </h1>
              <p className="text-muted-foreground">Personalized meal plan based on your preferences</p>
            </div>
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Edit Plan
            </Button>
          </div>
          
          <Card className="border-border/40">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your 7-Day Meal Plan</CardTitle>
                  <CardDescription>Based on {selectedGoal} goal with {dietType} diet</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
                    {calorieTarget} calories/day
                  </Badge>
                  <Button variant="outline" size="sm">
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <MealPlanDisplay 
                days={sampleMealPlan.days}
                mealPreferences={mealPreferences}
                currentDay={currentDay}
                setCurrentDay={setCurrentDay}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Info className="h-4 w-4 mr-1" />
                <span>Nutrition facts are approximate and may vary</span>
              </div>
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex flex-col gap-6">
        <Button 
          variant="ghost" 
          className="w-fit text-muted-foreground" 
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {step === 1 ? 'Back to Dashboard' : 'Previous Step'}
        </Button>
        
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <Apple className="mr-2 h-7 w-7 text-primary" />
            Create Nutrition Plan
          </h1>
          <p className="text-muted-foreground">Step {step} of 3</p>
        </div>
        
        <ProgressStepper currentStep={step} totalSteps={3} />
        
        <NutritionForm
          step={step}
          selectedGoal={selectedGoal}
          onGoalSelect={handleGoalSelect}
          dietType={dietType}
          setDietType={setDietType}
          restrictions={restrictions}
          onRestrictionToggle={handleRestrictionToggle}
          mealCount={mealCount}
          setMealCount={setMealCount}
          calorieTarget={calorieTarget}
          setCalorieTarget={setCalorieTarget}
          mealPreferences={mealPreferences}
          onMealPreferenceToggle={handleMealPreferenceToggle}
          isLoading={isLoading}
          onNext={handleNext}
          onBack={handleBack}
          goals={goals}
          dietaryOptions={dietaryOptions}
          restrictionOptions={restrictionOptions}
        />
      </div>
    </div>
  );
};

export default NutritionPage;
