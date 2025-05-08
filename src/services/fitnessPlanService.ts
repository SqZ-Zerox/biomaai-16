
import { sendGeminiCompletion } from "./geminiService";
import { toast } from "@/hooks/use-toast";

interface FitnessPlanRequest {
  goal: string;
  equipment: string[];
  minutesPerDay: number;
  healthData?: {
    bmi?: number;
    heartRate?: number;
    activityLevel?: string;
  };
}

interface Exercise {
  name: string;
  description: string;
  duration: string;
  sets?: number;
  reps?: number;
}

interface Workout {
  title: string;
  duration: string;
  exercises: Exercise[];
  focusAreas: string[];
}

export interface FitnessPlan {
  workouts: Workout[];
}

/**
 * Generate a personalized fitness plan using Gemini AI
 */
export async function generateFitnessPlan(request: FitnessPlanRequest): Promise<FitnessPlan | null> {
  try {
    // Construct a detailed prompt for Gemini
    const prompt = `
      Generate a detailed personalized fitness routine with the following requirements:
      - Primary goal: ${request.goal}
      - Available equipment: ${request.equipment.join(', ')}
      - Time available: ${request.minutesPerDay} minutes per day
      ${request.healthData ? `
      - BMI: ${request.healthData.bmi || 'Not provided'}
      - Resting heart rate: ${request.healthData.heartRate || 'Not provided'} bpm
      - Activity level: ${request.healthData.activityLevel || 'Not provided'}
      ` : ''}
      
      Please create 2 different workout routines (e.g., strength & conditioning and cardio).
      
      For each workout, include:
      - Workout title
      - Total duration
      - List of exercises with:
        - Name
        - Brief description
        - Duration/sets/reps
      - Focus areas
      
      Format the response as a JSON object with this structure:
      {
        "workouts": [
          {
            "title": "Workout Name",
            "duration": "30 minutes",
            "exercises": [
              {
                "name": "Exercise name",
                "description": "Brief description",
                "duration": "5 min",
                "sets": 3,
                "reps": 10
              },
              ...more exercises
            ],
            "focusAreas": ["area1", "area2"]
          },
          ...more workouts
        ]
      }
    `;

    // Send the prompt to Gemini
    const response = await sendGeminiCompletion([
      { role: "user", parts: [{ text: prompt }] }
    ], { temperature: 0.2 });

    if (!response) {
      throw new Error("Failed to generate fitness plan");
    }

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract valid JSON from the response");
    }

    const fitnessPlanData = JSON.parse(jsonMatch[0]) as FitnessPlan;
    
    // Validate the structure of the fitness plan
    if (!fitnessPlanData.workouts || !Array.isArray(fitnessPlanData.workouts) || fitnessPlanData.workouts.length === 0) {
      throw new Error("Invalid fitness plan structure");
    }
    
    return fitnessPlanData;
  } catch (error) {
    console.error("Error generating fitness plan:", error);
    toast({
      title: "Failed to generate fitness plan",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Generate exercise recommendations based on specific goals
 */
export async function generateExerciseRecommendations(
  goal: string,
  equipment: string[],
  focusArea: string
): Promise<string[]> {
  try {
    const prompt = `
      Recommend 5 specific exercises for:
      - Goal: ${goal}
      - Available equipment: ${equipment.join(', ')}
      - Focus area: ${focusArea}
      
      Format as a simple list of exercise names only.
    `;

    const response = await sendGeminiCompletion([
      { role: "user", parts: [{ text: prompt }] }
    ]);

    if (!response) {
      return [];
    }

    // Parse the response into a list of exercise names
    const exercises = response
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+[\.\)-]\s*/, '').trim())
      .filter(exercise => exercise.length > 0);

    return exercises.slice(0, 5); // Ensure we only return 5 exercises
  } catch (error) {
    console.error("Error generating exercise recommendations:", error);
    return [];
  }
}
