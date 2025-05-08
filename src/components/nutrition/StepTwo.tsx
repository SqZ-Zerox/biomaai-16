
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
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

export default StepTwo;
