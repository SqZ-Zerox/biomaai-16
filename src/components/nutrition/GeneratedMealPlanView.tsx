
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, FileText } from "lucide-react";
import WeeklyNutritionPlan from "./WeeklyNutritionPlan";
import { MealPlan, MealPreferences } from "./types";

interface GeneratedMealPlanViewProps {
  generatedPlan: MealPlan | null;
  mealPreferences: MealPreferences;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  selectedGoal: string;
  dietType: string;
  location: string;
  calorieTarget: number;
  error: boolean;
  handleTryAgain: () => void;
  handleViewRecipes: () => void;
}

const GeneratedMealPlanView: React.FC<GeneratedMealPlanViewProps> = ({
  generatedPlan,
  mealPreferences,
  currentDay,
  setCurrentDay,
  selectedGoal,
  dietType,
  location,
  calorieTarget,
  error,
  handleTryAgain,
  handleViewRecipes
}) => {
  if (!generatedPlan) {
    return (
      <Card className="border-border/40">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-semibold">No Plan Available</h2>
            <p className="mt-2 text-muted-foreground">
              There was a problem generating your nutrition plan.
            </p>
            <div className="flex justify-center mt-6 gap-4">
              <Button onClick={handleTryAgain}>
                Try Again
              </Button>
              <Button variant="outline" onClick={handleViewRecipes}>
                <FileText className="mr-2 h-4 w-4" />
                View Recipes Instead
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <WeeklyNutritionPlan
      days={generatedPlan.days || []}
      mealPreferences={mealPreferences}
      currentDay={currentDay}
      setCurrentDay={setCurrentDay}
      selectedGoal={selectedGoal}
      dietType={dietType}
      location={location}
      calorieTarget={calorieTarget}
      error={error}
      handleTryAgain={handleTryAgain}
      handleViewRecipes={handleViewRecipes}
    />
  );
};

export default GeneratedMealPlanView;
