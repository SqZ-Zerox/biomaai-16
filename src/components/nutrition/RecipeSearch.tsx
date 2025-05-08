
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

interface RecipeSearchProps {
  dietaryOptions: { id: string; label: string }[];
  onSearch: (params: {
    query: string;
    dietType: string;
    mealType: string;
    calories: number;
  }) => void;
  isLoading: boolean;
}

const RecipeSearch: React.FC<RecipeSearchProps> = ({
  dietaryOptions,
  onSearch,
  isLoading
}) => {
  const [query, setQuery] = useState("");
  const [dietType, setDietType] = useState("balanced");
  const [mealType, setMealType] = useState("lunch");
  const [calories, setCalories] = useState(500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query,
      dietType,
      mealType,
      calories
    });
  };

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="text-xl">Find Recipe Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="search">Search Keywords (optional)</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="e.g., chicken, pasta, salad"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Dietary Preference</Label>
            <RadioGroup value={dietType} onValueChange={setDietType}>
              <div className="grid grid-cols-2 gap-3">
                {dietaryOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`diet-${option.id}`} />
                    <Label htmlFor={`diet-${option.id}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-3">
            <Label>Meal Type</Label>
            <RadioGroup value={mealType} onValueChange={setMealType}>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="breakfast" id="meal-breakfast" />
                  <Label htmlFor="meal-breakfast" className="cursor-pointer">Breakfast</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lunch" id="meal-lunch" />
                  <Label htmlFor="meal-lunch" className="cursor-pointer">Lunch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dinner" id="meal-dinner" />
                  <Label htmlFor="meal-dinner" className="cursor-pointer">Dinner</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Target Calories: {calories}</Label>
            </div>
            <Slider
              min={200}
              max={1000}
              step={50}
              value={[calories]}
              onValueChange={(value) => setCalories(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Recipes will be suggested within approximately ±100 calories of this target
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            'Get Recipe Suggestions'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeSearch;
