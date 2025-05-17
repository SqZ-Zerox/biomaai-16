
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
  handleViewRecipes // This prop is passed but not used in this component directly after previous changes. Keeping it for now as it might be used by NutritionForm.
}) => {
  const stepTitles = ['Select Your Goal', 'Dietary Choices', 'Meal Setup', 'Your Location'];
  const currentStepTitle = stepTitles[step - 1] || 'Summary';

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl"> {/* Reduced py-8 to py-6 */}
      <div className="flex flex-col gap-6"> {/* Reduced gap-8 to gap-6 */}
        {step > 0 && ( // Changed from step > 0 for consistency, was step > 1. If back to dashboard logic is tied to step 1, this is fine. Let's assume step 0 is not a valid state for this component.
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
            Step {step} of {stepTitles.length}: {currentStepTitle}
          </p>
        </div>
        
        <ProgressStepper currentStep={step} totalSteps={stepTitles.length} />
        
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
