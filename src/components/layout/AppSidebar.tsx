
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
  Award
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

const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  
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

  return (
    <Sidebar data-state={state}>
      <SidebarHeader className="py-6">
        <div className="flex items-center gap-2 px-4">
          <div className="neon-border rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10 floating">
            <span className="text-primary font-bold">B</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Bioma<span className="text-primary">AI</span></h1>
        </div>
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
                    onClick={() => navigate(item.path)}
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
                    onClick={() => navigate(item.path)}
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
        <div className="px-4 text-xs text-muted-foreground">
          <p>© 2025 Bioma AI</p>
          <p className="mt-1">Health insights powered by AI</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
