
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Upload,
  Home
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
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Home",
      path: "/",
      icon: Home,
    },
    {
      title: "Study",
      path: "/study",
      icon: BookOpen,
    },
    {
      title: "Chat",
      path: "/chat",
      icon: MessageSquare,
    },
    {
      title: "Study Plan",
      path: "/study-plan",
      icon: Calendar,
    },
    {
      title: "Upload",
      path: "/upload",
      icon: Upload,
    },
  ];

  return (
    <Sidebar data-state={state}>
      <SidebarHeader className="py-6">
        <div className="flex items-center gap-2 px-4">
          <div className="neon-border rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10">
            <span className="text-accent font-bold">L</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Legal<span className="text-accent">Aid</span></h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    isActive={location.pathname === item.path} 
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon />
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
          <p>© 2025 LegalAid</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
