
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Search } from "lucide-react";
import { DietaryOption } from "./types";

interface RecipeSearchProps {
  dietaryOptions: DietaryOption[];
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
  const [query, setQuery] = useState<string>("Chicken");
  const [dietType, setDietType] = useState<string>("balanced");
  const [mealType, setMealType] = useState<string>("lunch");
  const [calories, setCalories] = useState<number>(500);
  
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
    <Card className="w-full border-border/40">
      <CardHeader>
        <CardTitle className="text-xl">Recipe Search</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="query">Search recipes</Label>
            <div className="flex space-x-2">
              <Input
                id="query"
                placeholder="e.g. Chicken, Pasta, etc."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Diet Type */}
          <div className="space-y-2">
            <Label>Diet Type</Label>
            <RadioGroup 
              value={dietType} 
              onValueChange={setDietType}
              className="grid grid-cols-2 gap-2"
            >
              {dietaryOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`diet-${option.value}`} />
                  <Label htmlFor={`diet-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {/* Meal Type */}
          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type</Label>
            <Select 
              value={mealType} 
              onValueChange={(value) => setMealType(value)}
            >
              <SelectTrigger id="mealType">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Calorie Range */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Calories per serving</Label>
              <span className="text-sm font-medium">{calories} kcal</span>
            </div>
            <Slider
              value={[calories]}
              min={200}
              max={800}
              step={50}
              onValueChange={(value) => setCalories(value[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>200</span>
              <span>500</span>
              <span>800</span>
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Get Recipe Suggestions
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeSearch;
