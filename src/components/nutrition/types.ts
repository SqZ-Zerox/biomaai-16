
export interface Goal {
  value: string;
  label: string;
  description: string;
}

export interface DietaryOption {
  value: string;
  label: string;
}

export interface RestrictionOption {
  value: string;
  label: string;
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

export interface DayMeals {
  id: number;
  meals: Meal[];
}

export interface MealPlan {
  days: DayMeals[];
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
