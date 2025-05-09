
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Calendar, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MealPlanDisplay from "@/components/nutrition/MealPlanDisplay";
import { MealPreferences, MealPlan } from "@/components/nutrition/types";

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
  const navigate = useNavigate();
  
  if (!generatedPlan) return null;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Apple className="mr-2 h-6 w-6 text-primary" />
              Your 30-Day Nutrition Plan
            </h1>
            <p className="text-muted-foreground">Personalized meal plan based on your preferences</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTryAgain}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Create New Plan
            </Button>
            <Button onClick={handleViewRecipes}>
              Find Recipes
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg mb-2">
            <h3 className="font-medium flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Using Sample Plan
            </h3>
            <p className="text-sm mt-1">
              We couldn't generate your personalized plan due to an API issue. 
              You're viewing a sample plan. Try again later or add your own Gemini API key in Settings.
            </p>
          </div>
        )}
        
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  30-Day Meal Plan
                </CardTitle>
                <CardDescription>
                  Based on {selectedGoal} goal with {dietType} diet
                  {location && ` • Optimized for ${location}`}
                </CardDescription>
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
              days={generatedPlan.days}
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
            <Button onClick={handleViewRecipes}>
              Find Recipe Ideas
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default GeneratedMealPlanView;
