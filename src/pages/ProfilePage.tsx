
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { extractHealthGoals, extractDietaryRestrictions, updateUserProfile } from "@/services/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/services/auth/types";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional(),
  phone_number: z.string().optional(),
  profession: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  activity_level: z.string().optional(),
});

const ProfilePage = () => {
  const { profile, refreshProfile, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      profession: "",
      birth_date: "",
      gender: "",
      height: "",
      weight: "",
      activity_level: "",
    },
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoadingData(true);

        if (profile) {
          // Fill form with profile data
          form.reset({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            email: profile.email || "",
            phone_number: profile.phone_number || "",
            profession: profile.profession || "",
            birth_date: profile.birth_date || "",
            gender: profile.gender || "",
            height: profile.height || "",
            weight: profile.weight || "",
            activity_level: profile.activity_level || "",
          });
          
          // Fetch health goals and dietary restrictions
          if (profile.id) {
            const [goals, restrictions] = await Promise.all([
              extractHealthGoals(profile.id),
              extractDietaryRestrictions(profile.id)
            ]);
            setHealthGoals(goals);
            setDietaryRestrictions(restrictions);
          }
          
          setProfileError(null);
        } else if (!authLoading) {
          setProfileError("Could not load profile data. Please try again later.");
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        setProfileError("Failed to load profile data. Please try refreshing the page.");
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadProfileData();
  }, [profile, form, authLoading]);

  // Function to retry loading profile if it failed
  const retryLoadProfile = async () => {
    setProfileError(null);
    await refreshProfile();
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Prepare profile update data
      const profileUpdate: Partial<UserProfile> = {
        ...data,
        // Ensure we don't include email as it's not part of the profiles table
        email: undefined
      };
      
      const result = await updateUserProfile(profileUpdate);
      
      if (result.error) {
        throw result.error;
      }
      
      // Refresh auth context to reflect changes
      await refreshProfile();
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(`Error updating profile: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoadingData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-destructive">Error Loading Profile</h2>
            <p className="mt-2 text-muted-foreground">{profileError}</p>
            <Button 
              onClick={retryLoadProfile} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold">Profile Not Found</h2>
            <p className="mt-2 text-muted-foreground">We couldn't find your profile information.</p>
            <Button 
              onClick={retryLoadProfile} 
              className="mt-4"
            >
              Refresh Profile
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
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
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input disabled placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="Profession" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth date</FormLabel>
                        <FormControl>
                          <Input type="date" placeholder="Birth date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="activity_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary</SelectItem>
                            <SelectItem value="lightly_active">Lightly Active</SelectItem>
                            <SelectItem value="moderately_active">Moderately Active</SelectItem>
                            <SelectItem value="very_active">Very Active</SelectItem>
                            <SelectItem value="extremely_active">Extremely Active</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Height" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Weight" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Goals</CardTitle>
            <CardDescription>Your current health objectives</CardDescription>
          </CardHeader>
          <CardContent>
            {healthGoals.length > 0 ? (
              <ul className="space-y-2">
                {healthGoals.map((goal, index) => (
                  <li key={index} className="flex items-center">
                    <Checkbox id={`goal-${index}`} defaultChecked disabled className="mr-3" />
                    <label htmlFor={`goal-${index}`} className="text-sm font-medium">
                      {goal}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No health goals set</p>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">You can update these goals during your next wellness assessment</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dietary Restrictions</CardTitle>
            <CardDescription>Your dietary preferences and restrictions</CardDescription>
          </CardHeader>
          <CardContent>
            {dietaryRestrictions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {dietaryRestrictions.map((restriction, index) => (
                  <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {restriction}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No dietary restrictions set</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
