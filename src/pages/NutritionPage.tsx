import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Apple, ArrowLeft, ArrowRight, Check, ChevronRight, Clock, 
  Flame, Info, Leaf, Loader2, Utensils 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const NutritionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [planGenerated, setPlanGenerated] = useState<boolean>(false);
  
  // Step 1: Goal selection
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  
  // Step 2: Dietary preferences
  const [dietType, setDietType] = useState<string>("balanced");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  
  // Step 3: Meal preferences
  const [mealCount, setMealCount] = useState<number>(3);
  const [calorieTarget, setCalorieTarget] = useState<number>(2000);
  const [mealPreferences, setMealPreferences] = useState<{
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    snacks: boolean;
  }>({
    breakfast: true,
    lunch: true,
    dinner: true,
    snacks: false,
  });
  
  // Meal plan data (would normally come from API)
  const [currentDay, setCurrentDay] = useState<number>(1);
  
  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
  };
  
  const handleRestrictionToggle = (restriction: string) => {
    if (restrictions.includes(restriction)) {
      setRestrictions(restrictions.filter(r => r !== restriction));
    } else {
      setRestrictions([...restrictions, restriction]);
    }
  };
  
  const handleMealPreferenceToggle = (meal: keyof typeof mealPreferences) => {
    setMealPreferences({
      ...mealPreferences,
      [meal]: !mealPreferences[meal]
    });
  };
  
  const handleNext = () => {
    // Validate current step
    if (step === 1 && !selectedGoal) {
      toast({
        title: "Please select a goal",
        description: "You need to select a nutrition goal to continue",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 3) {
      // Generate plan
      generatePlan();
      return;
    }
    
    setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/dashboard");
    }
  };
  
  const generatePlan = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPlanGenerated(true);
      toast({
        title: "Nutrition plan created!",
        description: "Your personalized nutrition plan is ready",
      });
    }, 2000);
  };
  
  const goals = [
    {
      id: "weight_loss",
      title: "Weight Loss",
      description: "Calorie-controlled plan to help you lose weight gradually",
      icon: <Flame className="h-6 w-6" />,
    },
    {
      id: "muscle_gain",
      title: "Muscle Building",
      description: "Higher protein plan to support muscle growth",
      icon: <Utensils className="h-6 w-6" />,
    },
    {
      id: "health_optimization",
      title: "Health Optimization",
      description: "Balanced nutrition based on your lab results",
      icon: <Leaf className="h-6 w-6" />,
    }
  ];
  
  const dietaryOptions = [
    { id: "balanced", label: "Balanced" },
    { id: "high_protein", label: "High Protein" },
    { id: "low_carb", label: "Low Carb" },
    { id: "keto", label: "Ketogenic" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
  ];
  
  const restrictionOptions = [
    { id: "gluten_free", label: "Gluten Free" },
    { id: "dairy_free", label: "Dairy Free" },
    { id: "nut_free", label: "Nut Free" },
    { id: "egg_free", label: "Egg Free" },
    { id: "shellfish_free", label: "Shellfish Free" },
    { id: "soy_free", label: "Soy Free" },
  ];
  
  // Sample meal plan data
  const mealPlan = {
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
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            selectedGoal={selectedGoal}
            onGoalSelect={handleGoalSelect}
            goals={goals}
          />
        );
      case 2:
        return (
          <StepTwo
            dietType={dietType}
            setDietType={setDietType}
            restrictions={restrictions}
            onRestrictionToggle={handleRestrictionToggle}
            dietaryOptions={dietaryOptions}
            restrictionOptions={restrictionOptions}
          />
        );
      case 3:
        return (
          <StepThree
            mealCount={mealCount}
            setMealCount={setMealCount}
            calorieTarget={calorieTarget}
            setCalorieTarget={setCalorieTarget}
            mealPreferences={mealPreferences}
            onMealPreferenceToggle={handleMealPreferenceToggle}
          />
        );
      default:
        return null;
    }
  };

  if (planGenerated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Apple className="mr-2 h-6 w-6 text-primary" />
                Your Nutrition Plan
              </h1>
              <p className="text-muted-foreground">Personalized meal plan based on your preferences</p>
            </div>
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Edit Plan
            </Button>
          </div>
          
          <Card className="border-border/40">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your 7-Day Meal Plan</CardTitle>
                  <CardDescription>Based on {selectedGoal} goal with {dietType} diet</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
                    {calorieTarget} calories/day
                  </Badge>
                  <Button variant="outline" size="sm">
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="1" onValueChange={(value) => setCurrentDay(parseInt(value))}>
                <TabsList className="grid grid-cols-7 mb-6">
                  {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
                    <TabsTrigger key={day} value={day.toString()} disabled={day > 2}>
                      Day {day}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {mealPlan.days.map((day) => (
                  <TabsContent key={day.id} value={day.id.toString()} className="space-y-4">
                    {day.meals
                      .filter(meal => 
                        (meal.type !== "snack" || mealPreferences.snacks) && 
                        (meal.type !== "breakfast" || mealPreferences.breakfast) &&
                        (meal.type !== "lunch" || mealPreferences.lunch) &&
                        (meal.type !== "dinner" || mealPreferences.dinner)
                      )
                      .map((meal, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="border border-border/40 hover:shadow-sm transition-all duration-200">
                            <CardContent className="p-5">
                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {meal.type === "breakfast" && (
                                      <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/20">
                                        Breakfast
                                      </Badge>
                                    )}
                                    {meal.type === "lunch" && (
                                      <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/20">
                                        Lunch
                                      </Badge>
                                    )}
                                    {meal.type === "dinner" && (
                                      <Badge className="bg-purple-500/15 text-purple-600 border-purple-500/20">
                                        Dinner
                                      </Badge>
                                    )}
                                    {meal.type === "snack" && (
                                      <Badge className="bg-green-500/15 text-green-600 border-green-500/20">
                                        Snack
                                      </Badge>
                                    )}
                                    <Badge className="bg-primary/10 text-primary border-primary/20">
                                      <Flame className="h-3 w-3 mr-1" />{meal.calories} cal
                                    </Badge>
                                  </div>
                                  
                                  <h3 className="text-lg font-medium mb-2">{meal.title}</h3>
                                  <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
                                  
                                  <div className="flex gap-3 text-xs">
                                    <span className="font-medium">Protein: {meal.protein}</span>
                                    <span className="font-medium">Carbs: {meal.carbs}</span>
                                    <span className="font-medium">Fat: {meal.fat}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </TabsContent>
                ))}
                
                {Array.from({ length: 5 }, (_, i) => i + 3).map((day) => (
                  <TabsContent key={day} value={day.toString()} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Your full 7-day plan is being optimized. Check back later for your complete meal plan!
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Info className="h-4 w-4 mr-1" />
                <span>Nutrition facts are approximate and may vary</span>
              </div>
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex flex-col gap-6">
        <Button 
          variant="ghost" 
          className="w-fit text-muted-foreground" 
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {step === 1 ? 'Back to Dashboard' : 'Previous Step'}
        </Button>
        
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <Apple className="mr-2 h-7 w-7 text-primary" />
            Create Nutrition Plan
          </h1>
          <p className="text-muted-foreground">Step {step} of 3</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-md">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div 
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    stepNum === step 
                      ? 'bg-primary text-primary-foreground'
                      : stepNum < step 
                        ? 'bg-primary/70 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stepNum < step ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div 
                    className={`h-1 flex-grow mx-1 rounded-full ${
                      stepNum < step
                        ? 'bg-primary/70'
                        : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <Card className="border-border/40">
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Plan...
                </>
              ) : (
                <>
                  {step === 3 ? 'Create Plan' : 'Next'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// Step components
interface StepOneProps {
  selectedGoal: string;
  onGoalSelect: (goal: string) => void;
  goals: any[];
}

const StepOne: React.FC<StepOneProps> = ({ selectedGoal, onGoalSelect, goals }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">What's your nutrition goal?</h2>
        <p className="text-muted-foreground">Select the main goal for your nutrition plan</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {goals.map((goal) => (
          <Card 
            key={goal.id}
            className={`cursor-pointer border transition-all duration-200 ${
              selectedGoal === goal.id 
                ? "border-primary bg-primary/5" 
                : "border-border/40 hover:border-primary/30"
            }`}
            onClick={() => onGoalSelect(goal.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  selectedGoal === goal.id 
                    ? "bg-primary/20" 
                    : "bg-muted/50"
                }`}>
                  {goal.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                <div className="flex items-center justify-center h-5 w-5 rounded-full border border-primary/50">
                  {selectedGoal === goal.id && (
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

interface StepTwoProps {
  dietType: string;
  setDietType: (diet: string) => void;
  restrictions: string[];
  onRestrictionToggle: (restriction: string) => void;
  dietaryOptions: {id: string, label: string}[];
  restrictionOptions: {id: string, label: string}[];
}

const StepTwo: React.FC<StepTwoProps> = ({ 
  dietType, 
  setDietType, 
  restrictions, 
  onRestrictionToggle,
  dietaryOptions,
  restrictionOptions
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Dietary Preferences</h2>
        <p className="text-muted-foreground">Select your preferred diet type and restrictions</p>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-3">
          <Label className="text-base">Diet Type</Label>
          <RadioGroup value={dietType} onValueChange={setDietType}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label className="text-base">Dietary Restrictions</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {restrictionOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={option.id} 
                  checked={restrictions.includes(option.id)}
                  onCheckedChange={() => onRestrictionToggle(option.id)}
                />
                <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StepThreeProps {
  mealCount: number;
  setMealCount: (count: number) => void;
  calorieTarget: number;
  setCalorieTarget: (calories: number) => void;
  mealPreferences: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    snacks: boolean;
  };
  onMealPreferenceToggle: (meal: "breakfast" | "lunch" | "dinner" | "snacks") => void;
}

const StepThree: React.FC<StepThreeProps> = ({
  mealCount,
  setMealCount,
  calorieTarget,
  setCalorieTarget,
  mealPreferences,
  onMealPreferenceToggle
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Meal Preferences</h2>
        <p className="text-muted-foreground">Customize your daily meal structure</p>
      </div>
      
      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-base">Meals per Day: {mealCount}</Label>
          <Slider
            min={2}
            max={6}
            step={1}
            value={[mealCount]}
            onValueChange={(value) => setMealCount(value[0])}
          />
        </div>
        
        <div className="space-y-3">
          <Label className="text-base">Daily Calorie Target: {calorieTarget}</Label>
          <Slider
            min={1200}
            max={4000}
            step={100}
            value={[calorieTarget]}
            onValueChange={(value) => setCalorieTarget(value[0])}
          />
          <p className="text-xs text-muted-foreground">
            Recommended based on your profile and activity level
          </p>
        </div>
        
        <div className="space-y-3">
          <Label className="text-base">Include Meal Types</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="breakfast" 
                checked={mealPreferences.breakfast}
                onCheckedChange={() => onMealPreferenceToggle("breakfast")}
              />
              <Label htmlFor="breakfast" className="cursor-pointer">Breakfast</Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="lunch" 
                checked={mealPreferences.lunch}
                onCheckedChange={() => onMealPreferenceToggle("lunch")}
              />
              <Label htmlFor="lunch" className="cursor-pointer">Lunch</Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="dinner" 
                checked={mealPreferences.dinner}
                onCheckedChange={() => onMealPreferenceToggle("dinner")}
              />
              <Label htmlFor="dinner" className="cursor-pointer">Dinner</Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="snacks" 
                checked={mealPreferences.snacks}
                onCheckedChange={() => onMealPreferenceToggle("snacks")}
              />
              <Label htmlFor="snacks" className="cursor-pointer">Snacks</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionPage;
