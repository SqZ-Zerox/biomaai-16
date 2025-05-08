
import { toast } from "@/hooks/use-toast";

// Edamam API configuration
const EDAMAM_APP_ID = "ed678d9a";
const EDAMAM_APP_KEY = "9b3776ab8432fb72a0178d04a0a0937d";
const BASE_URL = "https://api.edamam.com/api/recipes/v2";

export interface EdamamRecipe {
  uri: string;
  label: string;
  image: string;
  source: string;
  url: string;
  yield: number;
  calories: number;
  totalWeight: number;
  ingredientLines: string[];
  ingredients: {
    text: string;
    quantity: number;
    measure: string;
    food: string;
    weight: number;
    foodCategory: string;
  }[];
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  mealType?: string[];
}

export interface EdamamResponse {
  hits: {
    recipe: EdamamRecipe;
  }[];
  _links: {
    next?: {
      href: string;
    };
  };
}

export interface RecipeSearchParams {
  dietType?: string;
  mealType?: string;
  calories?: number;
  query?: string;
}

/**
 * Search for recipes using the Edamam API
 */
export const searchRecipes = async (params: RecipeSearchParams): Promise<EdamamRecipe[]> => {
  try {
    const { dietType, mealType, calories, query = "" } = params;
    
    // Build query parameters
    const queryParams = new URLSearchParams({
      type: "public",
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY,
      q: query,
    });
    
    // Add optional filters
    if (dietType && dietType !== "balanced") {
      queryParams.append("diet", dietType);
    }
    
    if (mealType) {
      queryParams.append("mealType", mealType);
    }
    
    if (calories) {
      // Create a calorie range (e.g., if calories = 500, search for 400-600 calories)
      const minCalories = Math.max(0, calories - 100);
      const maxCalories = calories + 100;
      queryParams.append("calories", `${minCalories}-${maxCalories}`);
    }
    
    // Make API request
    const response = await fetch(`${BASE_URL}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: EdamamResponse = await response.json();
    
    // Extract recipes from response
    return data.hits.map(hit => hit.recipe);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    toast({
      title: "Failed to fetch recipes",
      description: "There was an error connecting to the recipe service.",
      variant: "destructive",
    });
    return [];
  }
};
