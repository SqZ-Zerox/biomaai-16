
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
import { Loader2, UserCircle2, Shield, CircleUserRound, CalendarDays, Phone, GraduationCap, RulerIcon, Weight, ActivityIcon, AppleIcon, Dumbbell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  if (!user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Shield className="h-16 w-16 mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">Please sign in to view your profile.</p>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
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
  
  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        {!isEditing ? (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="personal">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="health">Health & Diet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CircleUserRound className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Account Created</Label>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Email Verified</Label>
                  <p className="font-medium">
                    {user.email_confirmed_at ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Verified</Badge>
                    ) : (
                      <Badge variant="destructive">Not Verified</Badge>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCircle2 className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your personal details</CardDescription>
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
                      />
                    ) : (
                      <p className="p-2 bg-muted/40 rounded-md">{profile.first_name || 'Not provided'}</p>
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
                      />
                    ) : (
                      <p className="p-2 bg-muted/40 rounded-md">{profile.last_name || 'Not provided'}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birth_date" className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" /> Birth Date
                    </Label>
                    {isEditing ? (
                      <Input
                        id="birth_date"
                        name="birth_date"
                        type="date"
                        value={formData.birth_date || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="p-2 bg-muted/40 rounded-md">
                        {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString() : 'Not provided'}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" /> Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number || ''}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="p-2 bg-muted/40 rounded-md">{profile.phone_number || 'Not provided'}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profession" className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-1" /> Profession
                  </Label>
                  {isEditing ? (
                    <Input
                      id="profession"
                      name="profession"
                      value={formData.profession || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your profession"
                    />
                  ) : (
                    <p className="p-2 bg-muted/40 rounded-md">{profile.profession || 'Not provided'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  {isEditing ? (
                    <Select value={formData.gender || ''} onValueChange={(value) => handleSelectChange('gender', value)}>
                      <SelectTrigger>
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
                    <p className="p-2 bg-muted/40 rounded-md capitalize">{profile.gender || 'Not provided'}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="health">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ActivityIcon className="h-5 w-5 mr-2" />
                  Physical Information
                </CardTitle>
                <CardDescription>Your physical metrics and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="height" className="flex items-center">
                    <RulerIcon className="h-4 w-4 mr-1" /> Height
                  </Label>
                  {isEditing ? (
                    <Input
                      id="height"
                      name="height"
                      value={formData.height || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your height (e.g., 5'10 or 178cm)"
                    />
                  ) : (
                    <p className="p-2 bg-muted/40 rounded-md">{profile.height || 'Not provided'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center">
                    <Weight className="h-4 w-4 mr-1" /> Weight
                  </Label>
                  {isEditing ? (
                    <Input
                      id="weight"
                      name="weight"
                      value={formData.weight || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your weight (e.g., 160lbs or 72kg)"
                    />
                  ) : (
                    <p className="p-2 bg-muted/40 rounded-md">{profile.weight || 'Not provided'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="activity_level">Activity Level</Label>
                  {isEditing ? (
                    <Select value={formData.activity_level || ''} onValueChange={(value) => handleSelectChange('activity_level', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="lightly-active">Lightly active (light exercise 1-3 days/week)</SelectItem>
                        <SelectItem value="moderately-active">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                        <SelectItem value="very-active">Very active (hard exercise 6-7 days/week)</SelectItem>
                        <SelectItem value="extra-active">Extra active (very hard exercise & physical job)</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="p-2 bg-muted/40 rounded-md capitalize">
                      {profile.activity_level?.replace('-', ' ') || 'Not provided'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Health Goals & Dietary Restrictions */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2" />
                    Health Goals
                  </div>
                </CardTitle>
                <CardDescription>Your health objectives and goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingHealthGoals ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : isEditing ? (
                  <ScrollArea className="h-48 rounded-md border p-4">
                    <div className="space-y-3">
                      {healthGoalOptions.map((goal) => (
                        <div key={goal.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`goal-${goal.id}`} 
                            checked={currentHealthGoals.includes(goal.label)}
                            onCheckedChange={() => toggleHealthGoal(goal.label)}
                          />
                          <Label htmlFor={`goal-${goal.id}`} className="cursor-pointer">{goal.label}</Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div>
                    {currentHealthGoals.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentHealthGoals.map((goal) => (
                          <Badge key={goal} variant="secondary">{goal}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No health goals set</p>
                    )}
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <AppleIcon className="h-4 w-4 mr-1" />
                    Dietary Restrictions
                  </Label>
                  {loadingDietaryRestrictions ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : isEditing ? (
                    <ScrollArea className="h-48 rounded-md border p-4">
                      <div className="space-y-3">
                        {dietaryRestrictionOptions.map((restriction) => (
                          <div key={restriction.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`restriction-${restriction.id}`} 
                              checked={currentDietaryRestrictions.includes(restriction.label)}
                              onCheckedChange={() => toggleDietaryRestriction(restriction.label)}
                            />
                            <Label htmlFor={`restriction-${restriction.id}`} className="cursor-pointer">{restriction.label}</Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div>
                      {currentDietaryRestrictions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {currentDietaryRestrictions.map((restriction) => (
                            <Badge key={restriction} variant="outline">{restriction}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No dietary restrictions set</p>
                      )}
                    </div>
                  )}
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
