
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MealPreferences } from "./types";

interface StepThreeProps {
  mealCount: number;
  setMealCount: (count: number) => void;
  calorieTarget: number;
  setCalorieTarget: (calories: number) => void;
  mealPreferences: MealPreferences;
  onMealPreferenceToggle: (meal: "breakfast" | "lunch" | "dinner" | "snacks") => void;
}

const StepThree: React.FC<StepThreeProps> = ({
  mealCount,
  setMealCount,
  calorieTarget,
  setCalorieTarget,
  mealPreferences,
  onMealPreferenceToggle
}) => {
  const mealTypes: Array<{id: keyof MealPreferences, label: string}> = [
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "snacks", label: "Snacks" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Customize Your Meals</h2>
        <p className="text-muted-foreground mt-1">Adjust daily meals, calorie targets, and preferred meal types.</p>
      </div>
      
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-lg">Daily Meal Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="mealCountSlider" className="text-base font-medium">Meals per Day</Label>
              <span className="text-primary font-semibold text-lg">{mealCount}</span>
            </div>
            <Slider
              id="mealCountSlider"
              min={2}
              max={6}
              step={1}
              value={[mealCount]}
              onValueChange={(value) => setMealCount(value[0])}
              className="my-2"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="calorieTargetSlider" className="text-base font-medium">Daily Calorie Target</Label>
              <span className="text-primary font-semibold text-lg">{calorieTarget} kcal</span>
            </div>
            <Slider
              id="calorieTargetSlider"
              min={1200}
              max={4000}
              step={50} // Finer control for calories
              value={[calorieTarget]}
              onValueChange={(value) => setCalorieTarget(value[0])}
              className="my-2"
            />
            <CardDescription className="text-xs">
              Adjust based on your activity level and goals. This is an estimate.
            </CardDescription>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardHeader>
            <CardTitle className="text-lg">Include Meal Types</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4">
                {mealTypes.map(mealType => (
                    <div key={mealType.id} className="flex items-center space-x-2 p-3 rounded-md border border-input hover:bg-muted/50 transition-colors">
                        <Checkbox 
                            id={mealType.id} 
                            checked={mealPreferences[mealType.id]}
                            onCheckedChange={() => onMealPreferenceToggle(mealType.id)}
                        />
                        <Label htmlFor={mealType.id} className="font-normal cursor-pointer flex-1">{mealType.label}</Label>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepThree;
