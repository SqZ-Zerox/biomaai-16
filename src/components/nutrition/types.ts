import React from "react";

export interface Goal {
  value: string;
  label: string;
  description: string;
  id: string;
  title: string;
  icon: React.ReactElement; // Changed from React.ReactNode to React.ReactElement
}

export interface DietaryOption {
  value: string;
  label: string;
  id: string;
}

export interface RestrictionOption {
  value: string;
  label: string;
  id: string;
}

export interface MealPreferences {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  snacks: boolean;
}

export interface Meal {
  type: string;
  title: string;
  description: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Day {
  id: number;
  meals: Meal[];
}

export interface DayMeals {
  id: number;
  meals: Meal[];
}

export interface MealPlan {
  days: DayMeals[];
}

export interface NutritionPlanRequest {
  goal: string;
  dietType: string;
  restrictions: string[];
  calorieTarget: number;
  mealPreferences: MealPreferences;
  location: string;
}

export interface RecipeSuggestion {
  id: string;
  name: string;
  image: string;
  calories: number;
  ingredients: string[];
  url: string;
  source: string;
  dietLabels: string[];
  healthLabels?: string[];
}
