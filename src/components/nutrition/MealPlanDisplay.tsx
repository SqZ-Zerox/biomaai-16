
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Flame, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { DayMeals, MealPreferences } from "./types";

interface MealPlanDisplayProps {
  days: DayMeals[];
  mealPreferences: MealPreferences;
  currentDay: number;
  setCurrentDay: (day: number) => void;
}

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ 
  days, 
  mealPreferences, 
  currentDay, 
  setCurrentDay 
}) => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const totalDays = days.length;
  const maxWeeks = Math.ceil(totalDays / 7);
  
  // Handle week navigation
  const handleNextWeek = () => {
    const nextWeek = Math.min(currentWeek + 1, maxWeeks);
    setCurrentWeek(nextWeek);
    const firstDayOfWeek = (nextWeek - 1) * 7 + 1;
    setCurrentDay(Math.min(firstDayOfWeek, totalDays));
  };
  
  const handlePrevWeek = () => {
    const prevWeek = Math.max(currentWeek - 1, 1);
    setCurrentWeek(prevWeek);
    const firstDayOfWeek = (prevWeek - 1) * 7 + 1;
    setCurrentDay(firstDayOfWeek);
  };
  
  // Calculate the days to display for the current week
  const weekStartIdx = (currentWeek - 1) * 7;
  const weekEndIdx = Math.min(weekStartIdx + 6, totalDays - 1);
  const daysInCurrentWeek = weekEndIdx - weekStartIdx + 1;
  
  const weekStartDay = weekStartIdx + 1;
  const weekEndDay = weekEndIdx + 1;
  
  // Get the days for the current week
  const currentWeekDays = days.slice(weekStartIdx, weekEndIdx + 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrevWeek} 
          disabled={currentWeek === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous Week
        </Button>
        
        <div className="font-medium">
          <Calendar className="h-4 w-4 inline mr-1" />
          Week {currentWeek} (Days {weekStartDay}-{weekEndDay})
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNextWeek} 
          disabled={currentWeek === maxWeeks}
        >
          Next Week
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <Tabs 
        defaultValue={currentDay.toString()} 
        value={currentDay.toString()} 
        onValueChange={(value) => setCurrentDay(parseInt(value))}
      >
        <TabsList className="grid grid-cols-7 mb-6">
          {currentWeekDays.map((day) => (
            <TabsTrigger key={day.id} value={day.id.toString()}>
              Day {day.id}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {days.map((day) => (
          <TabsContent key={day.id} value={day.id.toString()} className="space-y-4">
            <div className="mb-4 p-2 bg-primary/5 rounded-md">
              <h3 className="font-medium text-sm text-center">
                <Calendar className="h-4 w-4 inline mr-1" />
                Day {day.id} | Week {Math.ceil(day.id / 7)}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
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
                    <Card className="border-border/40 hover:shadow-sm transition-all duration-200">
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
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
                          
                          <div>
                            <h3 className="text-lg font-medium">{meal.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-3 text-xs bg-muted/30 p-2 rounded-md">
                            <div className="flex items-center">
                              <span className="font-medium text-primary mr-1">Protein:</span> {meal.protein}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium text-primary mr-1">Carbs:</span> {meal.carbs}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium text-primary mr-1">Fat:</span> {meal.fat}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MealPlanDisplay;
