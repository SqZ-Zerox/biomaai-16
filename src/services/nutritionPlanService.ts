
import { MealPlan, MealPreferences, NutritionPlanRequest } from "@/components/nutrition/types";
import { sendGeminiCompletion } from "./geminiService";
import { toast } from "@/hooks/use-toast";

/**
 * Generate a personalized meal plan using Gemini AI
 */
export async function generateNutritionPlan(request: NutritionPlanRequest): Promise<MealPlan | null> {
  try {
    // Construct a detailed prompt for Gemini
    const prompt = `
      Generate a detailed 30-day meal plan with the following requirements:
      - Primary goal: ${request.goal}
      - Diet type: ${request.dietType}
      - Dietary restrictions: ${request.restrictions.join(', ')}
      - Daily calorie target: ${request.calorieTarget} calories
      - Meal preferences: ${Object.entries(request.mealPreferences)
        .filter(([_, included]) => included)
        .map(([meal]) => meal)
        .join(', ')}
      - Location: ${request.location || 'Not specified'}
      
      Consider seasonal and locally available ingredients based on the user's location (${request.location || 'Unknown'}).
      If no location is provided, suggest general recipes that work for most regions.
      
      For each day, include the following meals (only if specified in preferences): 
      ${request.mealPreferences.breakfast ? "- Breakfast" : ""}
      ${request.mealPreferences.lunch ? "- Lunch" : ""}
      ${request.mealPreferences.dinner ? "- Dinner" : ""}
      ${request.mealPreferences.snacks ? "- Snacks" : ""}
      
      For each meal, provide:
      - Name
      - Brief description
      - Calories
      - Macros (protein, carbs, fat in grams)
      
      Format the response as a JSON object with this structure:
      {
        "days": [
          {
            "id": 1,
            "meals": [
              {
                "type": "breakfast",
                "title": "Meal name",
                "description": "Brief description",
                "calories": 500,
                "protein": "30g", 
                "carbs": "50g",
                "fat": "15g"
              },
              ...more meals
            ]
          },
          ...more days (30 total)
        ]
      }
    `;

    // Send the prompt to Gemini
    const response = await sendGeminiCompletion([
      { role: "user", parts: [{ text: prompt }] }
    ], { temperature: 0.2, maxOutputTokens: 30000 });

    if (!response) {
      throw new Error("Failed to generate meal plan");
    }

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract valid JSON from the response");
    }

    const mealPlanData = JSON.parse(jsonMatch[0]) as MealPlan;
    
    // Validate the structure of the meal plan
    if (!mealPlanData.days || !Array.isArray(mealPlanData.days) || mealPlanData.days.length === 0) {
      throw new Error("Invalid meal plan structure");
    }
    
    return mealPlanData;
  } catch (error) {
    console.error("Error generating nutrition plan:", error);
    toast({
      title: "Failed to generate nutrition plan",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Generate recipe suggestions based on dietary preferences and restrictions
 */
export async function generateRecipeSuggestions(
  dietType: string, 
  restrictions: string[], 
  calorieTarget: number,
  location: string
): Promise<string[]> {
  try {
    const prompt = `
      Suggest 5 recipes that match these criteria:
      - Diet type: ${dietType}
      - Dietary restrictions: ${restrictions.join(', ')}
      - Approximate calories: ${calorieTarget} per serving
      - Location: ${location || 'Not specified'} (consider locally available ingredients)
      
      Format as a simple list of recipe names only.
    `;

    const response = await sendGeminiCompletion([
      { role: "user", parts: [{ text: prompt }] }
    ]);

    if (!response) {
      return [];
    }

    // Parse the response into a list of recipe names
    const recipeNames = response
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+[\.\)-]\s*/, '').trim())
      .filter(recipe => recipe.length > 0);

    return recipeNames.slice(0, 5); // Ensure we only return 5 recipes
  } catch (error) {
    console.error("Error generating recipe suggestions:", error);
    return [];
  }
}
