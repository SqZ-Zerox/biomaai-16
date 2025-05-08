
export interface Goal {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface DietaryOption {
  id: string;
  label: string;
}

export interface RestrictionOption {
  id: string;
  label: string;
}

export interface MealPreferences {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  snacks: boolean;
}

export interface Meal {
  type: "breakfast" | "lunch" | "dinner" | "snack";
  title: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  description: string;
}

export interface Day {
  id: number;
  meals: Meal[];
}

export interface MealPlan {
  days: Day[];
}
