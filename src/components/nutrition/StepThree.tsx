
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
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
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Meal Preferences</h2>
        <p className="text-muted-foreground">Customize your daily meal structure</p>
      </div>
      
      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-base">Meals per Day: {mealCount}</Label>
          <Slider
            min={2}
            max={6}
            step={1}
            value={[mealCount]}
            onValueChange={(value) => setMealCount(value[0])}
          />
        </div>
        
        <div className="space-y-3">
          <Label className="text-base">Daily Calorie Target: {calorieTarget}</Label>
          <Slider
            min={1200}
            max={4000}
            step={100}
            value={[calorieTarget]}
            onValueChange={(value) => setCalorieTarget(value[0])}
          />
          <p className="text-xs text-muted-foreground">
            Recommended based on your profile and activity level
          </p>
        </div>
        
        <div className="space-y-3">
          <Label className="text-base">Include Meal Types</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="breakfast" 
                checked={mealPreferences.breakfast}
                onCheckedChange={() => onMealPreferenceToggle("breakfast")}
              />
              <Label htmlFor="breakfast" className="cursor-pointer">Breakfast</Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="lunch" 
                checked={mealPreferences.lunch}
                onCheckedChange={() => onMealPreferenceToggle("lunch")}
              />
              <Label htmlFor="lunch" className="cursor-pointer">Lunch</Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="dinner" 
                checked={mealPreferences.dinner}
                onCheckedChange={() => onMealPreferenceToggle("dinner")}
              />
              <Label htmlFor="dinner" className="cursor-pointer">Dinner</Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="snacks" 
                checked={mealPreferences.snacks}
                onCheckedChange={() => onMealPreferenceToggle("snacks")}
              />
              <Label htmlFor="snacks" className="cursor-pointer">Snacks</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
