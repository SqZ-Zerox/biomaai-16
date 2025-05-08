
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import RecipeSearch from "@/components/nutrition/RecipeSearch";
import RecipeSuggestions from "@/components/nutrition/RecipeSuggestions";
import { RecipeSuggestion } from "@/components/nutrition/types";
import { dietaryOptions } from "@/components/nutrition/data";
import { searchRecipes, EdamamRecipe } from "@/services/edamamService";

const RecipeSuggestionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (params: {
    query: string;
    dietType: string;
    mealType: string;
    calories: number;
  }) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await searchRecipes({
        query: params.query,
        dietType: params.dietType,
        mealType: params.mealType,
        calories: params.calories
      });
      
      // Transform API results to our format
      const suggestions = results.map(mapRecipeToSuggestion);
      setRecipes(suggestions);
      
      if (suggestions.length === 0) {
        toast({
          title: "No recipes found",
          description: "Try adjusting your search criteria.",
        });
      } else {
        toast({
          title: `${suggestions.length} recipes found`,
          description: "Showing recipe suggestions based on your preferences.",
        });
      }
    } catch (error) {
      console.error("Error in recipe search:", error);
      toast({
        title: "Search failed",
        description: "An error occurred while searching for recipes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to map API response to our format
  const mapRecipeToSuggestion = (recipe: EdamamRecipe): RecipeSuggestion => {
    return {
      id: recipe.uri.split("#recipe_")[1],
      name: recipe.label,
      image: recipe.image,
      calories: recipe.calories,
      ingredients: recipe.ingredientLines,
      url: recipe.url,
      source: recipe.source,
      dietLabels: recipe.dietLabels,
      healthLabels: recipe.healthLabels
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <Button 
            variant="ghost" 
            className="w-fit text-muted-foreground mb-6" 
            onClick={() => navigate("/nutrition")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Nutrition Plan
          </Button>
          
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Apple className="mr-2 h-6 w-6 text-primary" />
            Recipe Suggestions
          </h1>
          <p className="text-muted-foreground">
            Find delicious and healthy recipes based on your preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <RecipeSearch 
              dietaryOptions={dietaryOptions}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            {hasSearched ? (
              <RecipeSuggestions 
                recipes={recipes}
                isLoading={isLoading}
              />
            ) : (
              <div className="flex items-center justify-center h-full p-8 border border-dashed rounded-md">
                <p className="text-muted-foreground text-center">
                  Use the search panel on the left to find recipe suggestions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeSuggestionsPage;
