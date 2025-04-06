
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  PaintBucket, 
  Bell, 
  Lock, 
  UserCog, 
  Download, 
  Save, 
  Trash2, 
  RefreshCw,
  Moon,
  Sun,
  Check
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("appearance");
  
  // Appearance settings
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [fontScale, setFontScale] = useState<number>(100);
  const [primaryColor, setPrimaryColor] = useState<string>("blue");
  const [uiDensity, setUiDensity] = useState<string>("comfortable");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [dueDateReminders, setDueDateReminders] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>("1day");
  
  // Privacy settings
  const [shareUsageData, setShareUsageData] = useState<boolean>(true);
  const [showProfilePicture, setShowProfilePicture] = useState<boolean>(true);
  
  // Profile settings
  const [username, setUsername] = useState<string>("JaneDoe");
  const [email, setEmail] = useState<string>("jane.doe@example.com");
  const [bio, setBio] = useState<string>("Law student passionate about constitutional law and civil rights.");
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      
      // Appearance
      setIsDarkMode(parsedSettings.isDarkMode ?? true);
      setFontScale(parsedSettings.fontScale ?? 100);
      setPrimaryColor(parsedSettings.primaryColor ?? "blue");
      setUiDensity(parsedSettings.uiDensity ?? "comfortable");
      
      // Notifications
      setEmailNotifications(parsedSettings.emailNotifications ?? true);
      setDueDateReminders(parsedSettings.dueDateReminders ?? true);
      setReminderTime(parsedSettings.reminderTime ?? "1day");
      
      // Privacy
      setShareUsageData(parsedSettings.shareUsageData ?? true);
      setShowProfilePicture(parsedSettings.showProfilePicture ?? true);
      
      // Profile
      setUsername(parsedSettings.username ?? "JaneDoe");
      setEmail(parsedSettings.email ?? "jane.doe@example.com");
      setBio(parsedSettings.bio ?? "Law student passionate about constitutional law and civil rights.");
    }
    
    // Update document theme based on localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);
  
  // Save all settings
  const saveSettings = () => {
    // Update theme
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
    
    // Save all settings to localStorage
    const settings = {
      isDarkMode,
      fontScale,
      primaryColor,
      uiDensity,
      emailNotifications,
      dueDateReminders,
      reminderTime,
      shareUsageData,
      showProfilePicture,
      username,
      email,
      bio
    };
    
    localStorage.setItem("appSettings", JSON.stringify(settings));
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };
  
  // Reset all settings
  const resetSettings = () => {
    setIsDarkMode(true);
    setFontScale(100);
    setPrimaryColor("blue");
    setUiDensity("comfortable");
    setEmailNotifications(true);
    setDueDateReminders(true);
    setReminderTime("1day");
    setShareUsageData(true);
    setShowProfilePicture(true);
    
    // Save reset settings
    const settings = {
      isDarkMode: true,
      fontScale: 100,
      primaryColor: "blue",
      uiDensity: "comfortable",
      emailNotifications: true,
      dueDateReminders: true,
      reminderTime: "1day",
      shareUsageData: true,
      showProfilePicture: true,
      username,
      email,
      bio
    };
    
    localStorage.setItem("appSettings", JSON.stringify(settings));
    
    // Update theme
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
    
    toast({
      title: "Settings reset",
      description: "Your preferences have been restored to defaults.",
    });
  };
  
  // Export settings
  const exportSettings = () => {
    const settings = {
      isDarkMode,
      fontScale,
      primaryColor,
      uiDensity,
      emailNotifications,
      dueDateReminders,
      reminderTime,
      shareUsageData,
      showProfilePicture,
      username,
      email,
      bio
    };
    
    // Create a blob and download it
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "legalaid-settings.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings exported",
      description: "Your settings have been downloaded as a JSON file.",
    });
  };
  
  // Import settings
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        
        // Update all settings
        setIsDarkMode(importedSettings.isDarkMode ?? true);
        setFontScale(importedSettings.fontScale ?? 100);
        setPrimaryColor(importedSettings.primaryColor ?? "blue");
        setUiDensity(importedSettings.uiDensity ?? "comfortable");
        setEmailNotifications(importedSettings.emailNotifications ?? true);
        setDueDateReminders(importedSettings.dueDateReminders ?? true);
        setReminderTime(importedSettings.reminderTime ?? "1day");
        setShareUsageData(importedSettings.shareUsageData ?? true);
        setShowProfilePicture(importedSettings.showProfilePicture ?? true);
        
        // Save the imported settings
        localStorage.setItem("appSettings", JSON.stringify(importedSettings));
        
        // Update theme
        if (importedSettings.isDarkMode) {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
          localStorage.setItem("theme", "light");
        }
        
        toast({
          title: "Settings imported",
          description: "Your settings have been updated from the imported file.",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "There was an error importing your settings.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={saveSettings} className="gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>
      
      <Tabs 
        defaultValue="appearance" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <PaintBucket className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Privacy
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" /> Profile
          </TabsTrigger>
        </TabsList>
        
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Theme & Display</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark mode for a darker color scheme
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch 
                      id="dark-mode" 
                      checked={isDarkMode} 
                      onCheckedChange={setIsDarkMode}
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Font Size ({fontScale}%)</Label>
                  </div>
                  <Slider
                    value={[fontScale]}
                    min={80}
                    max={120}
                    step={5}
                    onValueChange={(value) => setFontScale(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Smaller</span>
                    <span>Larger</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Select value={primaryColor} onValueChange={setPrimaryColor}>
                    <SelectTrigger id="primary-color">
                      <SelectValue placeholder="Select a color theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue (Default)</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="ui-density">UI Density</Label>
                  <Select value={uiDensity} onValueChange={setUiDensity}>
                    <SelectTrigger id="ui-density">
                      <SelectValue placeholder="Select UI density" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comfortable">Comfortable (Default)</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="due-date-reminders">Due Date Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when tasks are approaching their due date
                    </p>
                  </div>
                  <Switch 
                    id="due-date-reminders" 
                    checked={dueDateReminders} 
                    onCheckedChange={setDueDateReminders}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="reminder-time">Reminder Time</Label>
                  <Select value={reminderTime} onValueChange={setReminderTime}>
                    <SelectTrigger id="reminder-time">
                      <SelectValue placeholder="Select when to be reminded" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1hour">1 hour before</SelectItem>
                      <SelectItem value="3hour">3 hours before</SelectItem>
                      <SelectItem value="12hour">12 hours before</SelectItem>
                      <SelectItem value="1day">1 day before (Default)</SelectItem>
                      <SelectItem value="3day">3 days before</SelectItem>
                      <SelectItem value="1week">1 week before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Data</CardTitle>
                <CardDescription>
                  Control your privacy settings and data usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="share-usage">Share Usage Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Help us improve by sharing anonymous usage data
                    </p>
                  </div>
                  <Switch 
                    id="share-usage" 
                    checked={shareUsageData} 
                    onCheckedChange={setShareUsageData}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-profile">Show Profile Picture</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your profile picture to other users
                    </p>
                  </div>
                  <Switch 
                    id="show-profile" 
                    checked={showProfilePicture} 
                    onCheckedChange={setShowProfilePicture}
                  />
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full mt-4">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete All My Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This will permanently delete all your data including tasks, events, and settings. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive">
                        Yes, Delete Everything
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    placeholder="Enter your username"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={bio} 
                    onChange={e => setBio(e.target.value)} 
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
      
      <div className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSettings} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Reset to Default
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSettings} className="gap-2">
            <Download className="h-4 w-4" /> Export Settings
          </Button>
          
          <div className="relative">
            <input
              type="file"
              id="import-settings"
              className="absolute inset-0 opacity-0 w-full cursor-pointer"
              accept=".json"
              onChange={importSettings}
            />
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" /> Import Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
