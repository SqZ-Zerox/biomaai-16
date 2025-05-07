
import React from "react";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/App";

const UserProfile = () => {
  const { profile } = useAuth();
  const { isDemoMode } = useDemoMode();
  
  // Show demo user info if in demo mode
  if (isDemoMode) {
    return (
      <div className="mt-4 px-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-amber-500" />
        </div>
        <div className="text-sm">
          <p className="font-medium">Demo User</p>
          <p className="text-xs text-muted-foreground">Demo Mode Active</p>
        </div>
      </div>
    );
  }
  
  if (!profile) return null;
  
  return (
    <div className="mt-4 px-4 flex items-center gap-2">
      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
        <User className="h-4 w-4 text-primary" />
      </div>
      <div className="text-sm">
        <p className="font-medium">{profile.first_name} {profile.last_name}</p>
        <p className="text-xs text-muted-foreground">User since {new Date(profile.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default UserProfile;
