
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  updateUserProfile, 
  extractDietaryRestrictions, 
  extractHealthGoals,
  updateHealthGoals,
  updateDietaryRestrictions
} from "@/services/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Loader2, UserCircle2, Shield, CircleUserRound, CalendarDays, Phone, GraduationCap, RulerIcon, Weight, ActivityIcon, AppleIcon, Dumbbell, RefreshCcw, Mail, Settings, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Health goals and dietary restrictions options
const healthGoalOptions = [
  { id: "weight-loss", label: "Weight Loss" },
  { id: "muscle-gain", label: "Build Muscle" },
  { id: "better-sleep", label: "Improve Sleep" },
  { id: "reduce-stress", label: "Reduce Stress" },
  { id: "improve-energy", label: "Increase Energy" },
  { id: "lower-blood-pressure", label: "Lower Blood Pressure" },
  { id: "manage-diabetes", label: "Manage Diabetes" },
  { id: "heart-health", label: "Improve Heart Health" },
  { id: "general-health", label: "Maintain General Health" },
  { id: "injury-recovery", label: "Recover from Injury" },
  { id: "mental-health", label: "Improve Mental Health" }
];

const dietaryRestrictionOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "nut-allergy", label: "Nut Allergy" },
  { id: "shellfish-allergy", label: "Shellfish Allergy" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "keto", label: "Ketogenic" },
  { id: "paleo", label: "Paleo" },
  { id: "low-fodmap", label: "Low FODMAP" },
  { id: "low-sodium", label: "Low Sodium" },
  { id: "halal", label: "Halal" },
  { id: "kosher", label: "Kosher" }
];

const ProfilePage = () => {
  const { user, profile, isLoading, refreshProfile, recoverUserData } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [loadingHealthGoals, setLoadingHealthGoals] = useState(true);
  const [loadingDietaryRestrictions, setLoadingDietaryRestrictions] = useState(true);
  const [currentHealthGoals, setCurrentHealthGoals] = useState<string[]>([]);
  const [currentDietaryRestrictions, setCurrentDietaryRestrictions] = useState<string[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    phone_number: '',
    profession: '',
    gender: '',
    height: '',
    weight: '',
    activity_level: ''
  });
  
  // Fetch health goals and dietary restrictions
  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (user?.id) {
        try {
          setLoadingHealthGoals(true);
          const goals = await extractHealthGoals(user.id);
          setCurrentHealthGoals(goals);
        } catch (error) {
          console.error("Error fetching health goals:", error);
        } finally {
          setLoadingHealthGoals(false);
        }
        
        try {
          setLoadingDietaryRestrictions(true);
          const restrictions = await extractDietaryRestrictions(user.id);
          setCurrentDietaryRestrictions(restrictions);
        } catch (error) {
          console.error("Error fetching dietary restrictions:", error);
        } finally {
          setLoadingDietaryRestrictions(false);
        }
      }
    };
    
    fetchAdditionalData();
  }, [user?.id]);
  
  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        birth_date: profile.birth_date || '',
        phone_number: profile.phone_number || '',
        profession: profile.profession || '',
        gender: profile.gender || '',
        height: profile.height || '',
        weight: profile.weight || '',
        activity_level: profile.activity_level || ''
      });
    }
  }, [profile]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-4 text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  if (!user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-muted/40 p-8 rounded-full mb-4">
          <Shield className="h-16 w-16 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">Please sign in to view your profile.</p>
        <Button onClick={() => navigate('/login')} size="lg" className="px-8">Sign In</Button>
      </div>
    );
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const toggleHealthGoal = (goal: string) => {
    setCurrentHealthGoals(prev => 
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };
  
  const toggleDietaryRestriction = (restriction: string) => {
    setCurrentDietaryRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };
  
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Save profile information
      const { profile: updatedProfile, error } = await updateUserProfile(formData);
      
      if (error) throw error;
      
      // Save health goals
      const healthGoalsResult = await updateHealthGoals(currentHealthGoals);
      if (!healthGoalsResult.success) throw healthGoalsResult.error;
      
      // Save dietary restrictions
      const dietaryRestrictionsResult = await updateDietaryRestrictions(currentDietaryRestrictions);
      if (!dietaryRestrictionsResult.success) throw dietaryRestrictionsResult.error;
      
      // Refresh profile data
      await refreshProfile();
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleRecoverData = async () => {
    setIsRecovering(true);
    try {
      await recoverUserData();
      toast.success("Profile data recovered successfully");
    } catch (error) {
      console.error("Error in handleRecoverData:", error);
      toast.error("Could not recover profile data");
    } finally {
      setIsRecovering(false);
    }
  };

  const getActivityLevelLabel = (level: string) => {
    switch(level) {
      case 'sedentary': return 'Sedentary (little or no exercise)';
      case 'lightly-active': return 'Lightly active (1-3 days/week)';
      case 'moderately-active': return 'Moderately active (3-5 days/week)';
      case 'very-active': return 'Very active (6-7 days/week)';
      case 'extra-active': return 'Extra active (very demanding)';
      default: return 'Not provided';
    }
  };
  
  return (
    <div className="container max-w-6xl py-8">
      {/* Profile Header */}
      <div className="relative mb-8">
        {/* Background banner */}
        <div className="h-32 rounded-t-xl bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-indigo-950 dark:to-blue-900"></div>
        
        {/* Profile content with avatar */}
        <div className="flex flex-col md:flex-row md:items-end px-6 -mt-12 gap-4">
          <div className="rounded-full bg-primary/20 w-24 h-24 flex items-center justify-center border-4 border-background shadow-lg">
            <UserCircle2 className="h-12 w-12 text-primary" />
          </div>
          
          <div className="flex-1 pt-2">
            <h1 className="text-3xl font-bold">
              {profile.first_name ? `${profile.first_name} ${profile.last_name || ''}` : 'Your Profile'}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
              {user.email_confirmed_at && (
                <Badge variant="pill" className="ml-1">Verified</Badge>
              )}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 pb-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRecoverData}
              disabled={isRecovering}
              className="flex items-center gap-1.5 text-sm"
            >
              {isRecovering ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
              Recover Data
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-sm">
                <Settings className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving} size="sm">
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center gap-1.5">
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="personal" className="space-y-8">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
          <TabsTrigger value="personal" className="text-sm">Personal Information</TabsTrigger>
          <TabsTrigger value="health" className="text-sm">Health & Wellness</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Information */}
            <Card className="overflow-hidden border-none bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-900/40 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CircleUserRound className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>Profile created on {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Status</p>
                    <div>
                      {user.email_confirmed_at ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="destructive">Not Verified</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="rounded-lg bg-primary/5 p-3">
                  <p className="text-sm text-center">
                    Member since {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="col-span-1 md:col-span-2 border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCircle2 className="h-5 w-5 text-primary" />
                  Personal Details
                </CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name || ''}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="bg-muted/40"
                      />
                    ) : (
                      <div className="p-2 rounded-md bg-muted/30 min-h-10">{profile.first_name || 'Not provided'}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        className="bg-muted/40"
                      />
                    ) : (
                      <div className="p-2 rounded-md bg-muted/30 min-h-10">{profile.last_name || 'Not provided'}</div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birth_date" className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" /> Birth Date
                    </Label>
                    {isEditing ? (
                      <Input
                        id="birth_date"
                        name="birth_date"
                        type="date"
                        value={formData.birth_date || ''}
                        onChange={handleInputChange}
                        className="bg-muted/40"
                      />
                    ) : (
                      <div className="p-2 rounded-md bg-muted/30 min-h-10">
                        {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString() : 'Not provided'}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number || ''}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="bg-muted/40"
                      />
                    ) : (
                      <div className="p-2 rounded-md bg-muted/30 min-h-10">{profile.phone_number || 'Not provided'}</div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profession" className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" /> Profession
                  </Label>
                  {isEditing ? (
                    <Input
                      id="profession"
                      name="profession"
                      value={formData.profession || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your profession"
                      className="bg-muted/40"
                    />
                  ) : (
                    <div className="p-2 rounded-md bg-muted/30 min-h-10">{profile.profession || 'Not provided'}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  {isEditing ? (
                    <Select value={formData.gender || ''} onValueChange={(value) => handleSelectChange('gender', value)}>
                      <SelectTrigger className="bg-muted/40">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 rounded-md bg-muted/30 min-h-10 capitalize">{profile.gender || 'Not provided'}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="health">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physical Information */}
            <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-900/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ActivityIcon className="h-5 w-5 text-emerald-600" />
                  Physical Information
                </CardTitle>
                <CardDescription>Your physical metrics and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center gap-1.5">
                      <RulerIcon className="h-3.5 w-3.5" /> Height
                    </Label>
                    {isEditing ? (
                      <Input
                        id="height"
                        name="height"
                        value={formData.height || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 5'10 or 178cm"
                        className="bg-white/50"
                      />
                    ) : (
                      <div className="p-2 rounded-md bg-white/50 min-h-10">{profile.height || 'Not provided'}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-1.5">
                      <Weight className="h-3.5 w-3.5" /> Weight
                    </Label>
                    {isEditing ? (
                      <Input
                        id="weight"
                        name="weight"
                        value={formData.weight || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., 160lbs or 72kg"
                        className="bg-white/50"
                      />
                    ) : (
                      <div className="p-2 rounded-md bg-white/50 min-h-10">{profile.weight || 'Not provided'}</div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="activity_level">Activity Level</Label>
                  {isEditing ? (
                    <Select value={formData.activity_level || ''} onValueChange={(value) => handleSelectChange('activity_level', value)}>
                      <SelectTrigger className="bg-white/50">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="lightly-active">Lightly active (1-3 days/week)</SelectItem>
                        <SelectItem value="moderately-active">Moderately active (3-5 days/week)</SelectItem>
                        <SelectItem value="very-active">Very active (6-7 days/week)</SelectItem>
                        <SelectItem value="extra-active">Extra active (very demanding)</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 rounded-md bg-white/50 min-h-10">
                      {profile.activity_level ? getActivityLevelLabel(profile.activity_level) : 'Not provided'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Health Goals & Dietary Restrictions */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  Health Objectives
                </CardTitle>
                <CardDescription>Your health goals and dietary preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Dumbbell className="h-3.5 w-3.5 text-primary" /> Health Goals
                    </h3>
                    {loadingHealthGoals ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    ) : isEditing ? (
                      <div className="border rounded-lg bg-muted/30">
                        <ScrollArea className="h-32 p-3">
                          <div className="space-y-2">
                            {healthGoalOptions.map((goal) => (
                              <div key={goal.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`goal-${goal.id}`} 
                                  checked={currentHealthGoals.includes(goal.label)}
                                  onCheckedChange={() => toggleHealthGoal(goal.label)}
                                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <Label htmlFor={`goal-${goal.id}`} className="cursor-pointer text-sm">{goal.label}</Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className="min-h-12">
                        {currentHealthGoals.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {currentHealthGoals.map((goal) => (
                              <Badge key={goal} variant="pill">{goal}</Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm p-2">No health goals set</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <AppleIcon className="h-3.5 w-3.5 text-primary" /> Dietary Restrictions
                    </h3>
                    {loadingDietaryRestrictions ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    ) : isEditing ? (
                      <div className="border rounded-lg bg-muted/30">
                        <ScrollArea className="h-32 p-3">
                          <div className="space-y-2">
                            {dietaryRestrictionOptions.map((restriction) => (
                              <div key={restriction.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`restriction-${restriction.id}`} 
                                  checked={currentDietaryRestrictions.includes(restriction.label)}
                                  onCheckedChange={() => toggleDietaryRestriction(restriction.label)}
                                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <Label htmlFor={`restriction-${restriction.id}`} className="cursor-pointer text-sm">{restriction.label}</Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className="min-h-12">
                        {currentDietaryRestrictions.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {currentDietaryRestrictions.map((restriction) => (
                              <Badge key={restriction} variant="ghost">{restriction}</Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm p-2">No dietary restrictions set</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
