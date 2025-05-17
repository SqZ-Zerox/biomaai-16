
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NutritionPlanCreator from '@/components/nutrition/NutritionPlanCreator';
import GeneratedMealPlanView from '@/components/nutrition/GeneratedMealPlanView';
import { useNutritionPlan } from '@/hooks/useNutritionPlan';
import { goals, dietaryOptions, restrictionOptions } from '@/components/nutrition/formData';
import { Loader2, RefreshCw } from 'lucide-react';

const MyPlanTab: React.FC = () => {
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
    generatedPlan,
    currentDay,
    setDietType,
    setMealCount,
    setCalorieTarget,
    setLocation,
    setCurrentDay,
    handleGoalSelect,
    handleRestrictionToggle,
    handleMealPreferenceToggle,
    handleNext,
    handleBack,
    handleViewRecipes,
    handleTryAgain,
  } = useNutritionPlan();

  if (isLoading && !planGenerated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generating Your Plan</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Our AI is crafting your personalized nutrition plan...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !generatedPlan) { // Error and no fallback plan shown yet
    return (
      <Card>
        <CardHeader>
          <CardTitle>Oops! Something Went Wrong</CardTitle>
          <CardDescription>We encountered an issue while generating your plan.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
          <p className="text-destructive">There was an error creating your personalized plan.</p>
          <Button onClick={handleTryAgain}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (planGenerated && generatedPlan) {
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
        // isLoading prop was passed before but is not defined in GeneratedMealPlanViewProps
        // if it's needed, it should be added to GeneratedMealPlanViewProps
      />
    );
  }

  // If no plan generated, and not loading, show the creator
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

export default MyPlanTab;

