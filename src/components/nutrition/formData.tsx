
import React from 'react';
import { Goal, DietaryOption, RestrictionOption } from "./types";
import { Apple, Target, Zap, Leaf, WheatOff, MilkOff, FishOff } from 'lucide-react'; // Removed Shrimp

export const goals: Goal[] = [
  {
    id: "weight-loss",
    value: "weight-loss", // value and id are often the same
    title: "Weight Loss",
    label: "Weight Loss", // label might be redundant if title is used
    description: "Create a plan to help you shed pounds sustainably.",
    icon: <Target className="h-6 w-6 text-primary" />,
  },
  {
    id: "muscle-gain",
    value: "muscle-gain",
    title: "Muscle Gain",
    label: "Muscle Gain",
    description: "Fuel your body for muscle growth and strength.",
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
  {
    id: "healthy-eating",
    value: "healthy-eating",
    title: "Healthy Eating",
    label: "Healthy Eating",
    description: "Adopt a balanced and nutritious diet for overall wellness.",
    icon: <Apple className="h-6 w-6 text-primary" />,
  },
  {
    id: "sports-performance",
    value: "sports-performance",
    title: "Sports Performance",
    label: "Sports Performance",
    description: "Optimize your nutrition for peak athletic performance.",
    icon: <Leaf className="h-6 w-6 text-primary" />, // Placeholder, find better icon if needed
  },
];

export const dietaryOptions: DietaryOption[] = [
  { id: "balanced", value: "balanced", label: "Balanced" },
  { id: "low-carb", value: "low-carb", label: "Low-Carb" },
  { id: "low-fat", value: "low-fat", label: "Low-Fat" },
  { id: "high-protein", value: "high-protein", label: "High-Protein" },
  { id: "vegetarian", value: "vegetarian", label: "Vegetarian" },
  { id: "vegan", value: "vegan", label: "Vegan" },
  { id: "keto", value: "keto", label: "Keto" },
  { id: "paleo", value: "paleo", label: "Paleo" },
];

export const restrictionOptions: RestrictionOption[] = [
  { id: "gluten-free", value: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", value: "dairy-free", label: "Dairy-Free" },
  { id: "nut-free", value: "nut-free", label: "Nut-Free (Peanuts & Tree Nuts)" },
  { id: "soy-free", value: "soy-free", label: "Soy-Free" },
  { id: "shellfish-free", value: "shellfish-free", label: "Shellfish-Free" }, // Icon for this is in the goals array, not directly here. The general restriction list does not use icons per item in the current structure.
  { id: "fish-free", value: "fish-free", label: "Fish-Free" },
];

