
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignupFormValues } from "./types";
import { slideVariants } from "./animations";

interface SignupMedicalStepProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
  onNext: () => void;
  onBack: () => void;
}

const SignupMedicalStep: React.FC<SignupMedicalStepProps> = ({ 
  form, 
  isLoading, 
  onNext, 
  onBack 
}) => {
  const medicalConditionOptions = [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'high_cholesterol', label: 'High Cholesterol' },
    { value: 'thyroid_disorder', label: 'Thyroid Disorder' },
    { value: 'heart_disease', label: 'Heart Disease' },
    { value: 'autoimmune', label: 'Autoimmune Condition' },
    { value: 'respiratory', label: 'Respiratory Condition' },
    { value: 'digestive', label: 'Digestive Condition' },
    { value: 'hormonal', label: 'Hormonal Imbalance' },
  ];
  
  const familyHistoryOptions = [
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'heart_disease', label: 'Heart Disease' },
    { value: 'cancer', label: 'Cancer' },
    { value: 'stroke', label: 'Stroke' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'thyroid_disorder', label: 'Thyroid Disorder' },
    { value: 'autoimmune', label: 'Autoimmune Condition' },
  ];

  return (
    <motion.div
      key="medical"
      initial="enterFromRight"
      animate="center"
      exit="exitToLeft"
      variants={slideVariants}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">4</div>
        <h3 className="text-lg font-medium">Medical History</h3>
      </div>
      
      <FormField
        control={form.control}
        name="existing_conditions"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>Existing Medical Conditions (if any)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {medicalConditionOptions.map((option) => (
                <FormField
                  key={option.value}
                  control={form.control}
                  name="existing_conditions"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.value}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const updatedConditions = checked
                                ? [...(field.value || []), option.value]
                                : (field.value || [])?.filter(
                                    (value) => value !== option.value
                                  );
                              field.onChange(updatedConditions);
                            }}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies (if any)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List any allergies you have..."
                  disabled={isLoading}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="medications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Medications (if any)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List any medications you're currently taking..."
                  disabled={isLoading}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="family_history"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>Family Medical History (if any)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {familyHistoryOptions.map((option) => (
                <FormField
                  key={option.value}
                  control={form.control}
                  name="family_history"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.value}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const updatedHistory = checked
                                ? [...(field.value || []), option.value]
                                : (field.value || [])?.filter(
                                    (value) => value !== option.value
                                  );
                              field.onChange(updatedHistory);
                            }}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="recent_lab_work"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Have you had any recent lab work done?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                className="flex flex-col space-y-1"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="lab-yes" />
                  <Label htmlFor="lab-yes">Yes, within the last 6 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="lab-no" />
                  <Label htmlFor="lab-no">No recent lab work</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_sure" id="lab-not-sure" />
                  <Label htmlFor="lab-not-sure">Not sure</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          type="button" 
          className="w-full" 
          onClick={onNext}
          disabled={isLoading}
        >
          Next: Terms & Conditions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default SignupMedicalStep;
