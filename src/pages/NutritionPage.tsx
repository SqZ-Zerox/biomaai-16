
import React from "react";
import { goals, dietaryOptions, restrictionOptions } from "@/components/nutrition/data";
import NutritionPlanCreator from "@/components/nutrition/NutritionPlanCreator";
import GeneratedMealPlanView from "@/components/nutrition/GeneratedMealPlanView";
import { useNutritionPlan } from "@/hooks/useNutritionPlan";

const NutritionPage = () => {
  const {
    step,
    isLoading,
    planGenerated,
    error,
    selectedGoal,
    dietType,
    restrictions,
    mealCount,
    calorieTarget,
    mealPreferences,
    location,
    currentDay,
    generatedPlan,
    setDietType,
    setMealCount,
    setCalorieTarget,
    setCurrentDay,
    setLocation,
    handleGoalSelect,
    handleRestrictionToggle,
    handleMealPreferenceToggle,
    handleNext,
    handleBack,
    handleViewRecipes,
    handleTryAgain
  } = useNutritionPlan();

  if (planGenerated) {
    return (
      <GeneratedMealPlanView
        generatedPlan={generatedPlan}
        mealPreferences={mealPreferences}
        currentDay={currentDay}
        setCurrentDay={setCurrentDay}
        selectedGoal={selectedGoal}
        dietType={dietType}
        location={location}
        calorieTarget={calorieTarget}
        error={error}
        handleTryAgain={handleTryAgain}
        handleViewRecipes={handleViewRecipes}
      />
    );
  }

  return (
    <NutritionPlanCreator
      step={step}
      selectedGoal={selectedGoal}
      onGoalSelect={handleGoalSelect}
      dietType={dietType}
      setDietType={setDietType}
      restrictions={restrictions}
      onRestrictionToggle={handleRestrictionToggle}
      mealCount={mealCount}
      setMealCount={setMealCount}
      calorieTarget={calorieTarget}
      setCalorieTarget={setCalorieTarget}
      mealPreferences={mealPreferences}
      onMealPreferenceToggle={handleMealPreferenceToggle}
      location={location}
      setLocation={setLocation}
      isLoading={isLoading}
      onNext={handleNext}
      onBack={handleBack}
      goals={goals}
      dietaryOptions={dietaryOptions}
      restrictionOptions={restrictionOptions}
      handleViewRecipes={handleViewRecipes}
    />
  );
};

export default NutritionPage;
