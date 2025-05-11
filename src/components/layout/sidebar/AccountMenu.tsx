
import React from "react";
import { NavLink } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const AccountMenu = () => {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <div className="px-2">
      <p className="text-xs uppercase font-medium text-muted-foreground tracking-wider mb-2 px-2">
        Account
      </p>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `group flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-primary/10 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`
              }
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `group flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-primary/10 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`
              }
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <button 
              onClick={handleSignOut}
              className="group flex w-full items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-destructive/10 text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};

export default AccountMenu;
