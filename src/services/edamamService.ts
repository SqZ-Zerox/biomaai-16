
import { toast } from "@/hooks/use-toast";
import { RecipeSuggestion } from "@/components/nutrition/types";
import { generateRecipeSuggestions } from "./nutritionPlanService";

// Types
export interface EdamamRecipeSearchParams {
  query: string;
  dietType?: string;
  mealType?: string;
  calories?: number;
}

export interface EdamamRecipe {
  uri: string;
  label: string;
  image: string;
  source: string;
  url: string;
  calories: number;
  ingredientLines: string[];
  dietLabels: string[];
  healthLabels: string[];
}

const APP_ID = "ed678d9a";
const APP_KEY = "9b3776ab8432fb72a0178d04a0a0937d";
const EDAMAM_ACCOUNT_USER = "0"; // This is a placeholder; use a proper user ID in production

/**
 * Search for recipes using the Edamam API
 */
export async function searchRecipes(params: EdamamRecipeSearchParams): Promise<EdamamRecipe[]> {
  try {
    const { query, dietType, mealType, calories } = params;
    
    // Build the URL with query parameters
    let url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${APP_ID}&app_key=${APP_KEY}&q=${encodeURIComponent(query || '')}`;
    
    // Add optional parameters if provided
    if (dietType) url += `&diet=${dietType}`;
    if (mealType) url += `&mealType=${mealType}`;
    if (calories) url += `&calories=${calories-100}-${calories+100}`; // Range around target calories
    
    console.log("Searching Edamam with URL:", url);

    // Make API request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Edamam-Account-User": EDAMAM_ACCOUNT_USER, // Add the required header
      }
    });
    
    // Check for errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching recipes:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Parse and return the recipes
    const data = await response.json();
    if (!data.hits || data.hits.length === 0) {
      console.log("No recipes found in API response");
      return [];
    }
    
    return data.hits.map((hit: any) => hit.recipe);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    
    // Fall back to Gemini API for recipe suggestions
    console.log("Falling back to Gemini API for recipe suggestions");
    try {
      const suggestions = await generateRecipeSuggestionsWithGemini(params);
      return suggestions;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      throw error;
    }
  }
}

/**
 * Generate recipe suggestions using Gemini as a fallback when the API fails
 */
async function generateRecipeSuggestionsWithGemini(params: EdamamRecipeSearchParams): Promise<EdamamRecipe[]> {
  const { query, dietType, mealType, calories } = params;
  
  try {
    // Get recipe suggestions from Gemini
    const recipeNames = await generateRecipeSuggestions(
      dietType || "balanced", 
      [], // No restrictions for fallback
      calories || 500
    );
    
    // Create simple recipe objects from the names
    return recipeNames.map((name, index) => ({
      uri: `http://example.com/recipe_${index}`,
      label: name,
      image: `https://via.placeholder.com/300x300?text=${encodeURIComponent(name)}`,
      source: "AI Generated",
      url: "#",
      calories: calories || 500,
      ingredientLines: ["Generated recipe - ingredients not available"],
      dietLabels: dietType ? [dietType] : ["balanced"],
      healthLabels: []
    }));
  } catch (error) {
    console.error("Failed to generate fallback recipes with Gemini:", error);
    return [];
  }
}

/**
 * Get recipe details
 */
export async function getRecipeDetails(recipeId: string): Promise<EdamamRecipe | null> {
  try {
    // In a real app, we'd make an API call to get detailed recipe info
    // For simplicity in this demo, we'll return null
    return null;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return null;
  }
}
