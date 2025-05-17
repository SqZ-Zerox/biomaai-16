
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DietaryOption, RestrictionOption } from "./types";

interface StepTwoProps {
  dietType: string;
  setDietType: (diet: string) => void;
  restrictions: string[];
  onRestrictionToggle: (restriction: string) => void;
  dietaryOptions: DietaryOption[];
  restrictionOptions: RestrictionOption[];
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Your Dietary Choices</h2>
        <p className="text-muted-foreground mt-1">Select your diet type and any restrictions.</p>
      </div>
      
      <div className="space-y-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-lg">Preferred Diet Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={dietType} onValueChange={setDietType} className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.id} id={`diet-${option.id}`} />
                  <Label htmlFor={`diet-${option.id}`} className="font-normal cursor-pointer flex-1">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-lg">Any Dietary Restrictions?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3">
              {restrictionOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Checkbox 
                    id={`restriction-${option.id}`}
                    checked={restrictions.includes(option.id)}
                    onCheckedChange={() => onRestrictionToggle(option.id)}
                  />
                  <Label htmlFor={`restriction-${option.id}`} className="font-normal cursor-pointer flex-1 leading-snug">{option.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StepTwo;
