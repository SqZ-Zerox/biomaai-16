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
import { 
  extractHealthGoals, 
  extractDietaryRestrictions, 
  updateUserProfile,
  updateHealthGoals,
  updateDietaryRestrictions 
} from "@/services/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/services/auth/types";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCcw, PlusCircle, X, Edit2, Save } from "lucide-react";

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
  const { 
    profile, 
    refreshProfile, 
    forceRefreshProfile,
    resetAuthState, 
    isLoading: authLoading,
    user 
  } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(0);
  
  // New state for editing health goals and dietary restrictions
  const [editingGoals, setEditingGoals] = useState(false);
  const [editingRestrictions, setEditingRestrictions] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [newRestriction, setNewRestriction] = useState('');
  const [editedHealthGoals, setEditedHealthGoals] = useState<string[]>([]);
  const [editedDietaryRestrictions, setEditedDietaryRestrictions] = useState<string[]>([]);
  
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
    let isActive = true; // To prevent state updates after unmount
    
    const loadProfileData = async () => {
      try {
        console.log("ProfilePage: Loading profile data, auth loading:", authLoading);
        setIsLoadingData(true);

        // If we're not loading and still don't have a profile, try to refresh it
        if (!authLoading && !profile && user && retryAttempts < 2) {
          console.log("ProfilePage: No profile but have user, refreshing...");
          await refreshProfile();
          if (isActive) setRetryAttempts(prev => prev + 1);
        }

        if (profile) {
          console.log("ProfilePage: Setting form data from profile");
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
            console.log("ProfilePage: Fetching health goals and dietary restrictions");
            const [goals, restrictions] = await Promise.all([
              extractHealthGoals(profile.id),
              extractDietaryRestrictions(profile.id)
            ]);
            if (isActive) {
              setHealthGoals(goals);
              setDietaryRestrictions(restrictions);
            }
          }
          
          if (isActive) setProfileError(null);
        } else if (!authLoading && retryAttempts >= 2) {
          console.error("ProfilePage: Could not load profile after retries");
          if (isActive) {
            setProfileError("We're having trouble loading your profile data. Please use the refresh button below.");
          }
        }
      } catch (error) {
        console.error("ProfilePage: Error loading profile data:", error);
        if (isActive) {
          setProfileError("Failed to load profile data. Please try refreshing the page.");
        }
      } finally {
        if (isActive) {
          setIsLoadingData(false);
        }
      }
    };
    
    loadProfileData();
    
    return () => {
      isActive = false;
    };
  }, [profile, form, authLoading, refreshProfile, user, retryAttempts]);

  // Initialize the edited arrays when the original data loads
  useEffect(() => {
    setEditedHealthGoals([...healthGoals]);
    setEditedDietaryRestrictions([...dietaryRestrictions]);
  }, [healthGoals, dietaryRestrictions]);
  
  // Function to retry loading profile with force refresh
  const retryLoadProfile = async () => {
    if (isLoading) return;
    
    setProfileError(null);
    setIsLoading(true);
    try {
      await forceRefreshProfile();
      setRetryAttempts(0);
    } catch (error) {
      console.error("Error force refreshing profile:", error);
      setProfileError("Failed to refresh profile. Please try again or reload the page.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to completely reset auth state
  const handleResetAuth = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await resetAuthState();
      toast.success("Auth state reset. Please reload the page if issues persist.");
    } catch (error) {
      console.error("Error resetting auth state:", error);
      toast.error("Failed to reset auth state");
    } finally {
      setIsLoading(false);
    }
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

  // New functions for managing health goals
  const handleAddGoal = () => {
    if (newGoal.trim() && !editedHealthGoals.includes(newGoal.trim())) {
      setEditedHealthGoals([...editedHealthGoals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (goalToRemove: string) => {
    setEditedHealthGoals(editedHealthGoals.filter(goal => goal !== goalToRemove));
  };

  const handleSaveGoals = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await updateHealthGoals(editedHealthGoals);
      if (result.success) {
        setHealthGoals([...editedHealthGoals]);
        toast.success("Health goals updated successfully");
      } else {
        toast.error("Failed to update health goals");
      }
      setEditingGoals(false);
    } catch (error) {
      toast.error("An error occurred while updating health goals");
    } finally {
      setIsLoading(false);
    }
  };

  // New functions for managing dietary restrictions
  const handleAddRestriction = () => {
    if (newRestriction.trim() && !editedDietaryRestrictions.includes(newRestriction.trim())) {
      setEditedDietaryRestrictions([...editedDietaryRestrictions, newRestriction.trim()]);
      setNewRestriction('');
    }
  };

  const handleRemoveRestriction = (restrictionToRemove: string) => {
    setEditedDietaryRestrictions(editedDietaryRestrictions.filter(restriction => restriction !== restrictionToRemove));
  };

  const handleSaveRestrictions = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await updateDietaryRestrictions(editedDietaryRestrictions);
      if (result.success) {
        setDietaryRestrictions([...editedDietaryRestrictions]);
        toast.success("Dietary restrictions updated successfully");
      } else {
        toast.error("Failed to update dietary restrictions");
      }
      setEditingRestrictions(false);
    } catch (error) {
      toast.error("An error occurred while updating dietary restrictions");
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
            
            <div className="mt-6 space-y-4">
              <Button 
                onClick={retryLoadProfile} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Refresh Profile
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleResetAuth} 
                variant="outline" 
                className="w-full"
                disabled={isLoading}
              >
                Reset Auth State
              </Button>
            </div>
            
            <div className="mt-8 text-sm text-muted-foreground">
              <p>Debug info: User ID: {user?.id || 'Not logged in'}</p>
              <p>Email verified: {user?.email_confirmed_at ? 'Yes' : 'No'}</p>
            </div>
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
            <div className="mt-6 space-y-4">
              <Button 
                onClick={retryLoadProfile} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Refresh Profile
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleResetAuth} 
                variant="outline" 
                className="w-full"
                disabled={isLoading}
              >
                Reset Auth State
              </Button>
            </div>
            
            <div className="mt-8 text-sm text-muted-foreground">
              <p>Debug info: User ID: {user?.id || 'Not logged in'}</p>
              <p>Email verified: {user?.email_confirmed_at ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <Button 
          variant="outline" 
          onClick={retryLoadProfile}
          disabled={isLoading}
          size="sm"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Health Goals</CardTitle>
              <CardDescription>Your current health objectives</CardDescription>
            </div>
            {!editingGoals ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEditingGoals(true)}
                disabled={isLoading}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleSaveGoals}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!editingGoals ? (
              healthGoals.length > 0 ? (
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
              )
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={newGoal} 
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Add new health goal"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddGoal} 
                    variant="outline"
                    disabled={!newGoal.trim()}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {editedHealthGoals.map((goal, index) => (
                    <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                      {goal}
                      <button 
                        onClick={() => handleRemoveGoal(goal)} 
                        className="ml-2 text-primary/70 hover:text-primary"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {editedHealthGoals.length === 0 && (
                    <p className="text-sm text-muted-foreground">No health goals added</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          {!editingGoals && (
            <CardFooter>
              <p className="text-xs text-muted-foreground">You can update these goals using the edit button</p>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dietary Restrictions</CardTitle>
              <CardDescription>Your dietary preferences and restrictions</CardDescription>
            </div>
            {!editingRestrictions ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEditingRestrictions(true)}
                disabled={isLoading}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleSaveRestrictions}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!editingRestrictions ? (
              dietaryRestrictions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {dietaryRestrictions.map((restriction, index) => (
                    <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {restriction}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No dietary restrictions set</p>
              )
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={newRestriction} 
                    onChange={(e) => setNewRestriction(e.target.value)}
                    placeholder="Add new dietary restriction"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddRestriction} 
                    variant="outline"
                    disabled={!newRestriction.trim()}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {editedDietaryRestrictions.map((restriction, index) => (
                    <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                      {restriction}
                      <button 
                        onClick={() => handleRemoveRestriction(restriction)} 
                        className="ml-2 text-primary/70 hover:text-primary"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {editedDietaryRestrictions.length === 0 && (
                    <p className="text-sm text-muted-foreground">No dietary restrictions added</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          {!editingRestrictions && dietaryRestrictions.length > 0 && (
            <CardFooter>
              <p className="text-xs text-muted-foreground">You can update your dietary restrictions using the edit button</p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
