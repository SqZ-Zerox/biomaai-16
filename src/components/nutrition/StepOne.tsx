
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added CardHeader, CardTitle, CardDescription
import { CheckCircle2 } from "lucide-react"; // Using a different check icon for a clearer selection
import { Goal } from "./types";

interface StepOneProps {
  selectedGoal: string;
  onGoalSelect: (goal: string) => void;
  goals: Goal[];
}

const StepOne: React.FC<StepOneProps> = ({ selectedGoal, onGoalSelect, goals }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">What's Your Primary Goal?</h2>
        <p className="text-muted-foreground mt-1">Choose the goal that best aligns with your aspirations.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <Card 
            key={goal.id}
            className={`cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:scale-[1.02]
                        ${selectedGoal === goal.id 
                            ? "border-primary border-2 shadow-lg bg-primary/5" 
                            : "border-border/40 hover:border-primary/60"
                        }`}
            onClick={() => onGoalSelect(goal.id)}
            tabIndex={0} // Make it focusable
            onKeyPress={(e) => e.key === 'Enter' && onGoalSelect(goal.id)} // Allow selection with Enter key
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-lg ${selectedGoal === goal.id ? "bg-primary/20" : "bg-muted"}`}>
                  {React.cloneElement(goal.icon, { className: `h-6 w-6 ${selectedGoal === goal.id ? 'text-primary' : 'text-muted-foreground'}` })}
                </div>
                {selectedGoal === goal.id && (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-medium mb-1">{goal.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed">{goal.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StepOne;
