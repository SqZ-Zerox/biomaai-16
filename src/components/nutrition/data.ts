
import { Apple, Flame, Leaf, Utensils } from "lucide-react";
import { Goal, DietaryOption, RestrictionOption, MealPlan } from "./types";
import React from "react";

// Sample data for nutrition plan
export const goals: Goal[] = [
  {
    id: "weight_loss",
    title: "Weight Loss",
    description: "Calorie-controlled plan to help you lose weight gradually",
    icon: React.createElement(Flame, { className: "h-6 w-6" }),
  },
  {
    id: "muscle_gain",
    title: "Muscle Building",
    description: "Higher protein plan to support muscle growth",
    icon: React.createElement(Utensils, { className: "h-6 w-6" }),
  },
  {
    id: "health_optimization",
    title: "Health Optimization",
    description: "Balanced nutrition based on your lab results",
    icon: React.createElement(Leaf, { className: "h-6 w-6" }),
  }
];

export const dietaryOptions: DietaryOption[] = [
  { id: "balanced", label: "Balanced" },
  { id: "high_protein", label: "High Protein" },
  { id: "low_carb", label: "Low Carb" },
  { id: "keto", label: "Ketogenic" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
];

export const restrictionOptions: RestrictionOption[] = [
  { id: "gluten_free", label: "Gluten Free" },
  { id: "dairy_free", label: "Dairy Free" },
  { id: "nut_free", label: "Nut Free" },
  { id: "egg_free", label: "Egg Free" },
  { id: "shellfish_free", label: "Shellfish Free" },
  { id: "soy_free", label: "Soy Free" },
];

// Sample meal plan data
export const sampleMealPlan: MealPlan = {
  days: [
    {
      id: 1,
      meals: [
        {
          type: "breakfast",
          title: "Greek Yogurt with Berries & Nuts",
          calories: 320,
          protein: "15g",
          carbs: "30g",
          fat: "18g",
          description: "Greek yogurt topped with mixed berries, honey, and almonds"
        },
        {
          type: "lunch",
          title: "Grilled Chicken Salad",
          calories: 450,
          protein: "35g",
          carbs: "25g",
          fat: "22g",
          description: "Grilled chicken breast with mixed greens, cherry tomatoes, avocado, and olive oil dressing"
        },
        {
          type: "dinner",
          title: "Baked Salmon with Quinoa",
          calories: 520,
          protein: "40g",
          carbs: "45g",
          fat: "28g",
          description: "Baked salmon fillet with lemon, herbs, quinoa, and steamed asparagus"
        },
        {
          type: "snack",
          title: "Apple with Almond Butter",
          calories: 180,
          protein: "5g",
          carbs: "20g",
          fat: "10g",
          description: "Medium apple with 1 tbsp almond butter"
        }
      ]
    },
    {
      id: 2,
      meals: [
        {
          type: "breakfast",
          title: "Protein Smoothie Bowl",
          calories: 350,
          protein: "25g",
          carbs: "40g",
          fat: "10g",
          description: "Protein smoothie with banana, spinach, berries, topped with granola and seeds"
        },
        {
          type: "lunch",
          title: "Turkey & Avocado Wrap",
          calories: 430,
          protein: "30g",
          carbs: "35g",
          fat: "20g",
          description: "Whole grain wrap with turkey, avocado, lettuce, tomato, and mustard"
        },
        {
          type: "dinner",
          title: "Grass-Fed Beef Stir Fry",
          calories: 480,
          protein: "35g",
          carbs: "40g",
          fat: "18g",
          description: "Lean beef stir fried with bell peppers, broccoli, and brown rice"
        },
        {
          type: "snack",
          title: "Greek Yogurt with Honey",
          calories: 150,
          protein: "15g",
          carbs: "15g",
          fat: "5g",
          description: "Plain Greek yogurt with a drizzle of honey"
        }
      ]
    }
  ]
};
