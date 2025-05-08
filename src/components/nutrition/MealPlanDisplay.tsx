
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Flame, Clock, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
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
  const maxWeeks = Math.ceil(days.length / 7);
  
  const handleNextWeek = () => {
    const nextWeek = Math.min(currentWeek + 1, maxWeeks);
    setCurrentWeek(nextWeek);
    const firstDayOfWeek = (nextWeek - 1) * 7 + 1;
    setCurrentDay(Math.min(firstDayOfWeek, days.length));
  };
  
  const handlePrevWeek = () => {
    const prevWeek = Math.max(currentWeek - 1, 1);
    setCurrentWeek(prevWeek);
    const firstDayOfWeek = (prevWeek - 1) * 7 + 1;
    setCurrentDay(firstDayOfWeek);
  };
  
  // Calculate the days to display for the current week
  const daysInWeek = (7 * currentWeek) > days.length 
    ? days.length - ((currentWeek - 1) * 7)
    : 7;
  
  const weekStartDay = (currentWeek - 1) * 7 + 1;
  const weekEndDay = Math.min(weekStartDay + 6, days.length);

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
          {Array.from({ length: daysInWeek }, (_, i) => {
            const dayNumber = weekStartDay + i;
            return (
              <TabsTrigger key={dayNumber} value={dayNumber.toString()}>
                Day {dayNumber}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {days.map((day) => (
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
        
        {Array.from({ length: 30 - days.length }, (_, i) => i + days.length + 1).map((day) => (
          <TabsContent key={day} value={day.toString()} className="text-center py-8">
            <div className="flex flex-col items-center justify-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your full 30-day plan is being optimized. Check back later for your complete meal plan!
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MealPlanDisplay;
