
import React, { useState } from "react";
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
  FlaskConical,
  Bookmark,
  ChevronDown,
  ArrowDown,
  ArrowUp,
  FileBarChart,
  Utensils,
  Zap,
  Heart,
  Clock,
  Leaf
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

  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
        <div>
          {/* Hero section with nutrition plan overview */}
          <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 p-8">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 bg-background/80">
                    {dietType.charAt(0).toUpperCase() + dietType.slice(1)} Diet
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
                    <Apple className="h-7 w-7 text-primary" />
                    Your 30-Day Nutrition Plan
                  </h1>
                  <p className="text-muted-foreground max-w-2xl">
                    Personalized for your {selectedGoal.replace('_', ' ')} goals, based on your preferences and health data.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                  <Button variant="outline" className="gap-2" onClick={handleViewRecipes}>
                    <FileText className="h-4 w-4" />
                    <span>Recipes</span>
                  </Button>
                  <Button className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Export to Calendar</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                <Card className="bg-background/70 backdrop-blur-sm border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <FileBarChart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Daily Target</p>
                        <p className="text-lg font-bold">{calorieTarget} cal</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/70 backdrop-blur-sm border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Utensils className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Goal</p>
                        <p className="text-lg font-bold capitalize">{selectedGoal.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/70 backdrop-blur-sm border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Diet Type</p>
                        <p className="text-lg font-bold capitalize">{dietType}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/70 backdrop-blur-sm border-none">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Adherence</p>
                        <p className="text-lg font-bold">{adherenceRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Main navigation with modern tabs */}
          <div className="mb-8">
            <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b">
                <TabsList className="bg-transparent h-auto p-0 mb-0">
                  <TabsTrigger 
                    value="summary" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 data-[state=active]:shadow-none"
                  >
                    Summary
                  </TabsTrigger>
                  <TabsTrigger 
                    value="meal-plan" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 data-[state=active]:shadow-none"
                  >
                    Meal Plan
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 data-[state=active]:shadow-none"
                  >
                    Lab Insights
                  </TabsTrigger>
                  <TabsTrigger 
                    value="progress" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 data-[state=active]:shadow-none"
                  >
                    Progress
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Summary Tab */}
              <TabsContent value="summary" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Weekly Nutrition Stats */}
                  <Card className="lg:col-span-2 border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" /> 
                        Weekly Nutrition Targets
                      </CardTitle>
                      <CardDescription>Based on your {calorieTarget} calorie daily target</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Protein</span>
                            <span>{weeklyProtein}g / week</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={75} className="h-2" />
                            <span className="text-sm text-muted-foreground whitespace-nowrap">75%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Carbohydrates</span>
                            <span>{weeklyCarbs}g / week</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={60} className="h-2" />
                            <span className="text-sm text-muted-foreground whitespace-nowrap">60%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Fat</span>
                            <span>{weeklyFat}g / week</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={40} className="h-2" />
                            <span className="text-sm text-muted-foreground whitespace-nowrap">40%</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Last updated: Today</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Plan Adherence */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" /> 
                        Plan Adherence
                      </CardTitle>
                      <CardDescription>Weekly tracking</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                      <div className="relative h-32 w-32 mb-4">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle
                            className="text-muted/30 stroke-current"
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
                          <div>
                            <p className="text-3xl font-bold text-center">{adherenceRate}%</p>
                            <p className="text-xs text-muted-foreground text-center">Adherence</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1.5 w-full">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                          <div key={day + i} className="text-xs text-center font-medium text-muted-foreground">
                            {day}
                          </div>
                        ))}
                        {[90, 85, 95, 70, 80, 75, 82].map((adherence, i) => (
                          <div 
                            key={i} 
                            className={`h-2 rounded-full w-full ${
                              adherence >= 90 ? 'bg-green-500/80' :
                              adherence >= 80 ? 'bg-green-500/60' :
                              adherence >= 70 ? 'bg-amber-500/60' :
                              'bg-red-500/60'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-4 text-center">
                        Keep going! You're doing better than last week.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommended Food Groups */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-primary" /> 
                      Recommended Food Groups
                    </CardTitle>
                    <CardDescription>Based on your lab results and goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {foodGroups.map((group, index) => (
                        <Card key={index} className={`p-3 bg-muted/20 border-none ${
                          group.importance === 'high' ? 'ring-1 ring-primary/30 bg-primary/5' : ''
                        }`}>
                          <div className="flex flex-col gap-2">
                            <div className={`self-start p-2 rounded-full ${
                              group.importance === 'high' ? 'bg-primary/20' : 'bg-muted/60'
                            }`}>
                              <Apple className="h-4 w-4 text-primary" />
                            </div>
                            <h4 className="font-medium text-sm">{group.name}</h4>
                            <p className="text-xs text-muted-foreground">{group.serving}</p>
                            <p className="text-xs mt-1 text-muted-foreground">Examples: {group.examples}</p>
                            {group.importance === 'high' && (
                              <Badge className="self-start mt-1 bg-primary/10 text-primary text-xs">Priority</Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Nutrition Insights */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" /> 
                        Nutrition Insights
                      </CardTitle>
                      <CardDescription>Based on your progress data</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border bg-card flex items-start gap-3">
                        <div className="p-2 rounded-full bg-green-500/20 text-green-600">
                          <ArrowUp className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Protein intake improved</h4>
                          <p className="text-sm text-muted-foreground">
                            Your protein intake has increased by 15% this week, helping your muscle recovery.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border bg-card flex items-start gap-3">
                        <div className="p-2 rounded-full bg-amber-500/20 text-amber-600">
                          <ArrowDown className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Hydration decreased</h4>
                          <p className="text-sm text-muted-foreground">
                            Your water intake is lower than recommended. Try to drink at least 8 glasses daily.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Meal Plan Tab */}
              <TabsContent value="meal-plan" className="mt-6">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-primary" /> 
                      Your 30-Day Meal Plan
                    </CardTitle>
                    <CardDescription>Customized for your goals and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <MealPlanDisplay 
                      days={days}
                      mealPreferences={mealPreferences}
                      currentDay={currentDay}
                      setCurrentDay={setCurrentDay}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Lab Insights Tab */}
              <TabsContent value="insights" className="mt-6 space-y-6">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-primary" /> 
                        Lab Test Insights
                      </CardTitle>
                      <CardDescription>Nutrition recommendations based on your lab results</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      View Full Report
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {labInsights.map((insight, index) => (
                        <Card key={index} className={`border ${
                          insight.status === 'low' ? 'border-amber-500/40 bg-amber-500/5' :
                          insight.status === 'high' ? 'border-red-500/40 bg-red-500/5' :
                          'border-green-500/40 bg-green-500/5'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${
                                  insight.status === 'low' ? 'bg-amber-500/20 text-amber-600' :
                                  insight.status === 'high' ? 'bg-red-500/20 text-red-600' :
                                  'bg-green-500/20 text-green-600'
                                }`}>
                                  <FlaskConical className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{insight.name}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{insight.recommendation}</p>
                                  <Badge variant="outline" className="mt-2 bg-background/80">
                                    Status: 
                                    <span className={`ml-1 font-medium ${
                                      insight.status === 'low' ? 'text-amber-600' :
                                      insight.status === 'high' ? 'text-red-600' :
                                      'text-green-600'
                                    }`}>
                                      {insight.status.charAt(0).toUpperCase() + insight.status.slice(1)}
                                    </span>
                                  </Badge>
                                </div>
                              </div>
                              
                              <Badge variant="outline" className={`${
                                insight.status === 'low' ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' :
                                insight.status === 'high' ? 'bg-red-500/10 text-red-600 border-red-500/30' :
                                'bg-green-500/10 text-green-600 border-green-500/30'
                              }`}>
                                {insight.status === 'low' ? 'Increase Intake' : 
                                 insight.status === 'high' ? 'Reduce Intake' : 
                                 'Maintain'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 text-sm text-muted-foreground">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Recommendations are based on your lab results from April 15, 2025
                  </CardFooter>
                </Card>
                
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Bookmark className="h-5 w-5 text-primary" /> 
                      Nutritional Priorities
                    </CardTitle>
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
                          Your vitamin D levels are below the optimal range. Focus on sun exposure (20-30 minutes daily), 
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

              {/* Progress Tab */}
              <TabsContent value="progress" className="mt-6 space-y-6">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" /> 
                      Weekly Progress
                    </CardTitle>
                    <CardDescription>Track your nutritional adherence</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Calendar Week View */}
                      <div>
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
                      </div>
                      
                      {/* Progress Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-muted/30 border-none">
                          <CardContent className="p-4 text-center">
                            <p className="text-xs text-muted-foreground">Weekly Average</p>
                            <p className="text-xl font-semibold mt-1">82%</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/30 border-none">
                          <CardContent className="p-4 text-center">
                            <p className="text-xs text-muted-foreground">Best Day</p>
                            <p className="text-xl font-semibold mt-1">95%</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/30 border-none">
                          <CardContent className="p-4 text-center">
                            <p className="text-xs text-muted-foreground">Goal Completion</p>
                            <p className="text-xl font-semibold mt-1">5/7</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/30 border-none">
                          <CardContent className="p-4 text-center">
                            <p className="text-xs text-muted-foreground">Trend</p>
                            <p className="text-xl font-semibold mt-1 text-green-600">+5%</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recommended Adjustments */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-primary" /> 
                      Recommended Adjustments
                    </CardTitle>
                    <CardDescription>Based on your progress and adherence</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Zap className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Increase protein intake on workout days</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Your protein consumption is lower than recommended on days you exercise.
                              Consider adding 20-30g of protein on these days.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Leaf className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">More consistent vegetable intake</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Your vegetable consumption varies throughout the week. Aim for consistent
                              daily intake of 3-4 vegetable servings.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between border-t pt-4">
                    <span className="text-sm text-muted-foreground">Last updated: Today</span>
                    <Button variant="outline" size="sm">
                      Apply Adjustments
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">Customize Plan</Button>
            <Button>Save Plan</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyNutritionPlan;
