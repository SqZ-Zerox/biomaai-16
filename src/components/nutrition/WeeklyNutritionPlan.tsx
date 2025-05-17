
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Apple, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  BarChart,
  Calendar,
  ChevronRight,
  FlaskConical
} from "lucide-react";
import MealPlanDisplay from "@/components/nutrition/MealPlanDisplay";
import { MealPreferences } from "@/components/nutrition/types";

interface WeeklyNutritionPlanProps {
  days: any[];
  mealPreferences: MealPreferences;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  selectedGoal: string;
  dietType: string;
  location: string;
  calorieTarget: number;
  error: boolean;
  handleTryAgain: () => void;
  handleViewRecipes: () => void;
}

const WeeklyNutritionPlan: React.FC<WeeklyNutritionPlanProps> = ({
  days,
  mealPreferences,
  currentDay,
  setCurrentDay,
  selectedGoal,
  dietType,
  location,
  calorieTarget,
  error,
  handleTryAgain,
  handleViewRecipes
}) => {
  // Calculate weekly nutritional metrics (this would ideally come from the backend)
  const weeklyProtein = 140; // g/week
  const weeklyCarbs = 280; // g/week
  const weeklyFat = 65; // g/week
  
  // Simulated adherence data
  const adherenceRate = 82; // percentage
  
  // Lab insights data (this would come from lab report integration)
  const labInsights = [
    { name: "Vitamin D", status: "low", recommendation: "Increase sun exposure and consider supplements" },
    { name: "Iron", status: "normal", recommendation: "Maintain current intake levels" },
    { name: "Omega-3", status: "low", recommendation: "Add fatty fish or flaxseed to your diet" }
  ];
  
  // Food groups based on nutritional needs
  const foodGroups = [
    { name: "Leafy Greens", importance: "high", serving: "2 cups daily", examples: "Spinach, Kale, Arugula" },
    { name: "Fatty Fish", importance: "high", serving: "3 servings weekly", examples: "Salmon, Mackerel, Sardines" },
    { name: "Whole Grains", importance: "medium", serving: "1-2 servings daily", examples: "Quinoa, Brown Rice, Oats" },
    { name: "Lean Protein", importance: "high", serving: "6oz daily", examples: "Chicken, Turkey, Tofu" },
    { name: "Berries", importance: "medium", serving: "1/2 cup daily", examples: "Blueberries, Strawberries, Raspberries" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {error ? (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
              <h2 className="mt-4 text-2xl font-semibold">Error Generating Plan</h2>
              <p className="mt-2 text-muted-foreground">
                We encountered an issue while creating your nutrition plan.
              </p>
              <Button onClick={handleTryAgain} className="mt-6">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Header with plan overview */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Apple className="mr-2 h-7 w-7 text-primary" />
                Weekly Nutrition Plan
              </h1>
              <p className="text-muted-foreground mt-1">
                Personalized plan based on your lab results and preferences
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleViewRecipes}>
                View Recipes
              </Button>
              <Button variant="outline" size="sm">
                Export Plan
              </Button>
            </div>
          </div>

          {/* Main content with tabs */}
          <Tabs defaultValue="dashboard">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="lab-insights">Lab Insights</TabsTrigger>
              <TabsTrigger value="meal-plan">Meal Plan</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>Weekly Nutrition Targets</CardTitle>
                      <Badge variant="outline">{selectedGoal}</Badge>
                    </div>
                    <CardDescription>Based on your {calorieTarget} calorie daily target</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Protein</span>
                          <span className="font-medium">{weeklyProtein}g / week</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Carbohydrates</span>
                          <span className="font-medium">{weeklyCarbs}g / week</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Fat</span>
                          <span className="font-medium">{weeklyFat}g / week</span>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Plan Adherence</CardTitle>
                    <CardDescription>This week's progress</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex flex-col items-center justify-center h-full py-6">
                      <div className="relative h-32 w-32">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle
                            className="text-muted stroke-current"
                            strokeWidth="10"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                          />
                          <circle
                            className="text-primary stroke-current"
                            strokeWidth="10"
                            strokeLinecap="round"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            strokeDasharray={`${adherenceRate * 2.51} ${100 * 2.51}`}
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">{adherenceRate}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        Keep up the good work! Try to maintain consistency.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recommended Food Groups */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recommended Food Groups</CardTitle>
                  <CardDescription>Based on your lab results and goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {foodGroups.map((group, index) => (
                      <div key={index} className="flex p-3 bg-muted/40 rounded-lg">
                        <div className={`mr-4 p-2 rounded-full ${
                          group.importance === 'high' ? 'bg-primary/20' : 'bg-muted/60'
                        }`}>
                          <Apple className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{group.name}</h4>
                            {group.importance === 'high' && (
                              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary text-xs">Priority</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{group.serving}</p>
                          <p className="text-xs mt-1">Examples: {group.examples}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Lab Insights Tab */}
            <TabsContent value="lab-insights" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Lab Test Insights</CardTitle>
                    <CardDescription>Nutrition recommendations based on your latest lab results</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">
                    <FileText className="mr-2 h-4 w-4" />
                    View Full Report
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {labInsights.map((insight, index) => (
                      <div key={index} className="border-b border-border/50 last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              insight.status === 'low' 
                                ? 'bg-amber-500/20 text-amber-600' 
                                : insight.status === 'high' 
                                ? 'bg-red-500/20 text-red-600'
                                : 'bg-green-500/20 text-green-600'
                            }`}>
                              <FlaskConical className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-medium">{insight.name}</h4>
                              <span className="text-xs">
                                Status: 
                                <span className={`ml-1 font-medium ${
                                  insight.status === 'low' 
                                    ? 'text-amber-600' 
                                    : insight.status === 'high' 
                                    ? 'text-red-600'
                                    : 'text-green-600'
                                }`}>
                                  {insight.status.charAt(0).toUpperCase() + insight.status.slice(1)}
                                </span>
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className={`${
                            insight.status === 'low' 
                              ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' 
                              : insight.status === 'high' 
                              ? 'bg-red-500/10 text-red-600 border-red-500/30'
                              : 'bg-green-500/10 text-green-600 border-green-500/30'
                          }`}>
                            {insight.status === 'low' ? 'Increase Intake' : insight.status === 'high' ? 'Reduce Intake' : 'Maintain'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {insight.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 text-sm text-muted-foreground">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Recommendations are based on your lab results from April 15, 2025
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Nutritional Priorities</CardTitle>
                  <CardDescription>Focus areas based on your test results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                      <h3 className="font-medium flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                        Primary Focus: Increase Vitamin D Levels
                      </h3>
                      <p className="text-sm mt-2">
                        Your vitamin D levels are below optimal range. Focus on sun exposure (20-30 minutes daily), 
                        fatty fish consumption, and consider a vitamin D supplement.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/40 border border-muted rounded-lg">
                      <h3 className="font-medium flex items-center">
                        <BarChart className="mr-2 h-4 w-4" />
                        Secondary Focus: Omega-3 Fatty Acids
                      </h3>
                      <p className="text-sm mt-2">
                        Your omega-3 levels could be improved. Incorporate fatty fish (salmon, mackerel), 
                        walnuts, flaxseeds, and chia seeds into your weekly meal plan.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Meal Plan Tab - Using existing functionality */}
            <TabsContent value="meal-plan">
              <MealPlanDisplay 
                days={days}
                mealPreferences={mealPreferences}
                currentDay={currentDay}
                setCurrentDay={setCurrentDay}
              />
            </TabsContent>
            
            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>Track your nutritional adherence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Calendar Week View */}
                    <div className="grid grid-cols-7 gap-2 text-center">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                        <div key={day} className="text-xs font-medium">{day}</div>
                      ))}
                      {/* Mock adherence data for each day */}
                      {[90, 85, 95, 70, 80, 75, 80].map((adherence, i) => (
                        <div 
                          key={i} 
                          className={`rounded-full aspect-square flex items-center justify-center text-xs ${
                            adherence >= 90 ? 'bg-green-500/20 text-green-700' :
                            adherence >= 80 ? 'bg-green-500/10 text-green-600' :
                            adherence >= 70 ? 'bg-amber-500/10 text-amber-600' :
                            'bg-red-500/10 text-red-600'
                          }`}
                        >
                          {adherence}%
                        </div>
                      ))}
                    </div>
                    
                    {/* Progress Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/30 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Weekly Average</p>
                        <p className="text-xl font-semibold mt-1">82%</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Best Day</p>
                        <p className="text-xl font-semibold mt-1">95%</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Goal Completion</p>
                        <p className="text-xl font-semibold mt-1">5/7</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Trend</p>
                        <p className="text-xl font-semibold mt-1 text-green-600">+5%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recommended Adjustments */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Recommended Adjustments</CardTitle>
                  <CardDescription>Based on your progress and adherence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start p-3 bg-muted/30 rounded-lg">
                      <Calendar className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                      <div>
                        <h4 className="font-medium">Increase protein intake on workout days</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your protein consumption is lower than recommended on days you exercise.
                          Consider adding 20-30g of protein on these days.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-muted/30 rounded-lg">
                      <TrendingUp className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                      <div>
                        <h4 className="font-medium">More consistent vegetable intake</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your vegetable consumption varies throughout the week. Aim for consistent
                          daily intake of 3-4 vegetable servings.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <span className="text-sm text-muted-foreground">Last updated: Today</span>
                  <Button variant="outline" size="sm">
                    Apply Adjustments
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">Customize Plan</Button>
            <Button>Save Plan</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyNutritionPlan;
