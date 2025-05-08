import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Apple, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import RecipeSearch from "@/components/nutrition/RecipeSearch";
import RecipeSuggestions from "@/components/nutrition/RecipeSuggestions";
import { RecipeSuggestion } from "@/components/nutrition/types";
import { dietaryOptions } from "@/components/nutrition/data";
import { searchRecipes, EdamamRecipe } from "@/services/edamamService";
import { Card } from "@/components/ui/card";

const RecipeSuggestionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (params: {
    query: string;
    dietType: string;
    mealType: string;
    calories: number;
  }) => {
    setIsLoading(true);
    setHasSearched(true);
    setErrorMessage(null);
    
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
      setErrorMessage("We couldn't connect to our recipe database. Using AI-generated suggestions instead.");
      
      // Generate fallback recipes with Gemini
      try {
        const aiRecipeNames = await generateAIFallbackRecipes(params);
        const suggestions = aiRecipeNames.map((name, index) => ({
          id: `ai-${index}`,
          name: name,
          image: `https://via.placeholder.com/300x300?text=${encodeURIComponent(name.substring(0, 20))}`,
          calories: params.calories,
          ingredients: ["AI generated recipe - ingredients not available"],
          url: "#",
          source: "AI Assistant",
          dietLabels: [params.dietType || "balanced"],
          healthLabels: []
        }));
        
        setRecipes(suggestions);
        
        toast({
          title: "Using AI recipe suggestions",
          description: "We've generated some recipe ideas based on your preferences.",
        });
      } catch (fallbackError) {
        toast({
          title: "Search failed",
          description: "An error occurred while searching for recipes.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to generate fallback recipes using Gemini
  const generateAIFallbackRecipes = async (params: any): Promise<string[]> => {
    // Import here to avoid circular dependency
    const { generateRecipeSuggestions } = await import("../services/nutritionPlanService");
    
    try {
      return await generateRecipeSuggestions(
        params.dietType || "balanced",
        [],
        params.calories || 500,
        "" // Empty string for location since we don't have it in recipe search
      );
    } catch (error) {
      console.error("Failed to generate AI recipes:", error);
      return [
        "Healthy Breakfast Bowl",
        "Protein-Packed Lunch Salad",
        "Balanced Dinner Plate",
        "Nutritious Smoothie",
        "Energy-Boosting Snack"
      ];
    }
  };
  
  // Helper function to map API response to our format
  const mapRecipeToSuggestion = (recipe: EdamamRecipe): RecipeSuggestion => {
    return {
      id: recipe.uri.split("#recipe_")[1] || `recipe-${Math.random().toString(36).substring(2, 9)}`,
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
            {errorMessage && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4 mb-4 text-sm">
                {errorMessage}
              </div>
            )}
            {hasSearched ? (
              <RecipeSuggestions 
                recipes={recipes}
                isLoading={isLoading}
              />
            ) : (
              <Card className="flex flex-col items-center justify-center h-full p-12 border-dashed text-center">
                <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-medium mb-2">Find Your Perfect Recipe</h3>
                <p className="text-muted-foreground max-w-md">
                  Use the search panel to discover recipes that match your dietary preferences and calorie goals
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeSuggestionsPage;
