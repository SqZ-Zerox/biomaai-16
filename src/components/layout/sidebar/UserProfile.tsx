
import React from "react";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const UserProfile = () => {
  const { profile } = useAuth();
  
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
