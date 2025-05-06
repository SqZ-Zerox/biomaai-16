
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  MessageCircle, 
  FileText, 
  Settings,
  User,
  HeartPulse,
  Apple,
  Dumbbell,
  Bell,
  HelpCircle,
  Award,
  LogOut
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar";

import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const AppSidebar = () => {
  const { state, close } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      title: "Lab Reports",
      path: "/upload",
      icon: FileText,
    },
    {
      title: "Nutrition Plan",
      path: "/nutrition",
      icon: Apple,
    },
    {
      title: "Fitness Routine",
      path: "/fitness",
      icon: Dumbbell,
    },
    {
      title: "Health Progress",
      path: "/progress",
      icon: HeartPulse,
    },
    {
      title: "Bioma Chat",
      path: "/chat",
      icon: MessageCircle,
    }
  ];
  
  const secondaryMenuItems = [
    {
      title: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
    {
      title: "Achievements",
      path: "/achievements",
      icon: Award,
    },
    {
      title: "Help & Support",
      path: "/help",
      icon: HelpCircle,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: User,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      close();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar data-state={state}>
      <SidebarHeader className="py-6">
        <div className="flex items-center gap-2 px-4">
          <div className="neon-border rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10 floating">
            <span className="text-primary font-bold">B</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Bioma<span className="text-primary">AI</span></h1>
        </div>
        {profile && (
          <div className="mt-4 px-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium">{profile.first_name} {profile.last_name}</p>
              <p className="text-xs text-muted-foreground">User since {new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent className="sidebar-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel>Core Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    isActive={location.pathname === item.path} 
                    onClick={() => handleNavigation(item.path)}
                    className="transition-all duration-300 hover:bg-primary/10"
                  >
                    <item.icon className="text-primary" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="my-2" />
        
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    isActive={location.pathname === item.path} 
                    onClick={() => handleNavigation(item.path)}
                    className="transition-all duration-300 hover:bg-primary/10"
                  >
                    <item.icon className="text-primary" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="py-4">
        <div className="px-4 space-y-4">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
          
          <div className="text-xs text-muted-foreground">
            <p>© 2025 Bioma AI</p>
            <p className="mt-1">Health insights powered by AI</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
