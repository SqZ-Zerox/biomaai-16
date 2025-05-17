
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import { Goal, DietaryOption, RestrictionOption, MealPreferences } from "./types";

interface NutritionFormProps {
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
  onMealPreferenceToggle: (meal: "breakfast" | "lunch" | "dinner" | "snacks") => void;
  location: string;
  setLocation: (location: string) => void;
  isLoading: boolean;
  onNext: () => void;
  onBack: () => void;
  goals: Goal[];
  dietaryOptions: DietaryOption[];
  restrictionOptions: RestrictionOption[];
}

const NutritionForm: React.FC<NutritionFormProps> = ({
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
  restrictionOptions
}) => {
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            selectedGoal={selectedGoal}
            onGoalSelect={onGoalSelect}
            goals={goals}
          />
        );
      case 2:
        return (
          <StepTwo
            dietType={dietType}
            setDietType={setDietType}
            restrictions={restrictions}
            onRestrictionToggle={onRestrictionToggle}
            dietaryOptions={dietaryOptions}
            restrictionOptions={restrictionOptions}
          />
        );
      case 3:
        return (
          <StepThree
            mealCount={mealCount}
            setMealCount={setMealCount}
            calorieTarget={calorieTarget}
            setCalorieTarget={setCalorieTarget}
            mealPreferences={mealPreferences}
            onMealPreferenceToggle={onMealPreferenceToggle}
          />
        );
      case 4:
        return (
          <StepFour
            location={location}
            setLocation={setLocation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-border/40">
      <CardContent className="pt-4"> {/* Reduced pt-6 to pt-4 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t">
        {/* Back button in footer can be conditional if step > 1, or handled by onBack logic */}
        <Button
          variant="outline"
          onClick={onBack}
          // disabled={step === 1} // Optionally disable if onBack for step 1 navigates away
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Plan...
            </>
          ) : (
            <>
              {step === 4 ? 'Create Plan' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NutritionForm;
