
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, Calendar, Phone, AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignupFormValues } from "./types";
import { slideVariants } from "./animations";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignupPersonalStepProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
  onNext: () => void;
  onBack: () => void;
}

const SignupPersonalStep: React.FC<SignupPersonalStepProps> = ({ 
  form, 
  isLoading, 
  onNext, 
  onBack 
}) => {
  // Check if birth date has error (age validation failed)
  const birthDateError = form.formState.errors.birth_date;

  // Calculate the max date (13 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <motion.div
      key="personal"
      initial="enterFromRight"
      animate="center"
      exit="exitToLeft"
      variants={slideVariants}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">2</div>
        <h3 className="text-lg font-medium">Personal Information</h3>
      </div>
      
      {birthDateError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            {birthDateError.message as string}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="John" 
                    className="pl-10" 
                    disabled={isLoading}
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Doe" 
                    className="pl-10" 
                    disabled={isLoading}
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="birth_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Birth Date</FormLabel>
            <FormControl>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="date"
                  className="pl-10" 
                  disabled={isLoading}
                  {...field}
                  value={field.value || ''}
                  max={maxDateString}
                  onChange={(e) => {
                    field.onChange(e);
                    
                    // Validate age as the user selects a date
                    const selectedDate = new Date(e.target.value);
                    const today = new Date();
                    const age = today.getFullYear() - selectedDate.getFullYear();
                    const monthDiff = today.getMonth() - selectedDate.getMonth();
                    
                    // If birthday hasn't occurred yet this year, subtract a year
                    const adjustedAge = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) 
                      ? age - 1 
                      : age;
                      
                    if (adjustedAge < 13) {
                      form.setError('birth_date', {
                        type: 'manual',
                        message: 'You must be at least 13 years old to use this service.'
                      });
                    } else {
                      form.clearErrors('birth_date');
                    }
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
            <p className="text-xs text-muted-foreground mt-1">You must be at least 13 years old to use this service.</p>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number (Optional)</FormLabel>
            <FormControl>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="+1 (555) 000-0000" 
                  className="pl-10" 
                  disabled={isLoading}
                  {...field}
                  value={field.value || ''}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                className="grid grid-cols-2 gap-3"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="gender-male" />
                  <Label htmlFor="gender-male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="gender-female" />
                  <Label htmlFor="gender-female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non_binary" id="gender-non-binary" />
                  <Label htmlFor="gender-non-binary">Non-Binary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefer_not_to_say" id="gender-prefer-not" />
                  <Label htmlFor="gender-prefer-not">Prefer not to say</Label>
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
          disabled={isLoading || !!birthDateError}
        >
          Next: Health Profile
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default SignupPersonalStep;
