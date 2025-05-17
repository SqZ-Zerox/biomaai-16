import React from "react";
import { Apple, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressStepper from "@/components/nutrition/ProgressStepper";
import NutritionForm from "@/components/nutrition/NutritionForm";
import { MealPreferences } from "@/components/nutrition/types";
import { Goal, DietaryOption, RestrictionOption } from "@/components/nutrition/types";

interface NutritionPlanCreatorProps {
  step: number;
  selectedGoal: string;
  onGoalSelect: (goal: string) => void;
  dietType: string;
  setDietType: (diet: string) => void;
  restrictions: string[];
  onRestrictionToggle: (restriction: string) => void;
  mealCount: number;
  setMealCount: (count: number) => void;
  calorieTarget: number;
  setCalorieTarget: (calories: number) => void;
  mealPreferences: MealPreferences;
  onMealPreferenceToggle: (meal: keyof MealPreferences) => void;
  location: string;
  setLocation: (location: string) => void;
  isLoading: boolean;
  onNext: () => void;
  onBack: () => void;
  goals: Goal[];
  dietaryOptions: DietaryOption[];
  restrictionOptions: RestrictionOption[];
  handleViewRecipes: () => void;
}

const NutritionPlanCreator: React.FC<NutritionPlanCreatorProps> = ({
  step,
  selectedGoal,
  onGoalSelect,
  dietType,
  setDietType,
  restrictions,
  onRestrictionToggle,
  mealCount,
  setMealCount,
  calorieTarget,
  setCalorieTarget,
  mealPreferences,
  onMealPreferenceToggle,
  location,
  setLocation,
  isLoading,
  onNext,
  onBack,
  goals,
  dietaryOptions,
  restrictionOptions,
  handleViewRecipes
}) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex flex-col gap-8">
        {step > 0 && (
          <Button 
            variant="ghost" 
            className="w-fit text-muted-foreground self-start -ml-4" 
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {step === 1 ? 'Back to Dashboard' : 'Previous Step'}
          </Button>
        )}
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <Apple className="mr-3 h-8 w-8 text-primary" />
            Create Your Nutrition Plan
          </h1>
          <p className="text-muted-foreground text-lg">
            Step {step} of 4: {['Select Your Goal', 'Dietary Choices', 'Meal Setup', 'Your Location'][step - 1] || 'Summary'}
          </p>
        </div>
        
        <ProgressStepper currentStep={step} totalSteps={4} />
        
        <NutritionForm
          step={step}
          selectedGoal={selectedGoal}
          onGoalSelect={onGoalSelect}
          dietType={dietType}
          setDietType={setDietType}
          restrictions={restrictions}
          onRestrictionToggle={onRestrictionToggle}
          mealCount={mealCount}
          setMealCount={setMealCount}
          calorieTarget={calorieTarget}
          setCalorieTarget={setCalorieTarget}
          mealPreferences={mealPreferences}
          onMealPreferenceToggle={onMealPreferenceToggle}
          location={location}
          setLocation={setLocation}
          isLoading={isLoading}
          onNext={onNext}
          onBack={onBack}
          goals={goals}
          dietaryOptions={dietaryOptions}
          restrictionOptions={restrictionOptions}
        />
      </div>
    </div>
  );
};

export default NutritionPlanCreator;
