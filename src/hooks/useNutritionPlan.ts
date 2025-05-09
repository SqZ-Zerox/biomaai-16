
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MealPreferences, MealPlan } from "@/components/nutrition/types";
import { generateNutritionPlan } from "@/services/nutritionPlanService";
import { sampleMealPlan } from "@/components/nutrition/data";

export function useNutritionPlan() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [planGenerated, setPlanGenerated] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  
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
  
  // Step 4: Location
  const [location, setLocation] = useState<string>("");
  
  // Meal plan data
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);
  
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
    
    if (step === 4) {
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
  
  const generatePlan = async () => {
    setIsLoading(true);
    setError(false);
    
    console.log("Generating nutrition plan with params:", {
      goal: selectedGoal,
      dietType,
      restrictions,
      calorieTarget,
      mealPreferences,
      location
    });
    
    try {
      // Call the Gemini-powered nutrition plan generator
      const planData = await generateNutritionPlan({
        goal: selectedGoal,
        dietType,
        restrictions,
        calorieTarget,
        mealPreferences,
        location
      });
      
      if (planData && planData.days && planData.days.length > 0) {
        setGeneratedPlan(planData);
        setPlanGenerated(true);
        toast({
          title: `${planData.days.length}-day nutrition plan created!`,
          description: "Your AI-generated nutrition plan is ready",
        });
      } else {
        throw new Error("Failed to generate a complete meal plan");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      setError(true);
      
      // Use sample data as fallback
      setGeneratedPlan(sampleMealPlan);
      setPlanGenerated(true);
      
      toast({
        title: "Using sample plan",
        description: "We couldn't generate your personalized plan. Using a sample plan instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRecipes = () => {
    navigate("/recipes");
  };

  const handleTryAgain = () => {
    setPlanGenerated(false);
    setError(false);
    setStep(1);
  };

  return {
    step,
    isLoading,
    planGenerated,
    error,
    selectedGoal,
    dietType,
    restrictions,
    mealCount, 
    calorieTarget,
    mealPreferences,
    location,
    currentDay,
    generatedPlan,
    setDietType,
    setMealCount,
    setCalorieTarget,
    setCurrentDay,
    setLocation,
    handleGoalSelect,
    handleRestrictionToggle,
    handleMealPreferenceToggle,
    handleNext,
    handleBack,
    handleViewRecipes,
    handleTryAgain
  };
}
