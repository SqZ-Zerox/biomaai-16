
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Goal } from "./types";

interface StepOneProps {
  selectedGoal: string;
  onGoalSelect: (goal: string) => void;
  goals: Goal[];
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

export default StepOne;
