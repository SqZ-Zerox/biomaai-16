
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Upload,
  Home,
  BookOpenCheck,
  Award,
  HelpCircle,
  FileText,
  Gavel,
  BookmarkCheck,
  Library,
  ExternalLink
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

import { cn } from "@/lib/utils";
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
      title: "Productivity Hub",
      path: "/study-plan",
      icon: Calendar,
    },
    {
      title: "Legal Essays",
      path: "/legal-essays",
      icon: FileText,
    },
    {
      title: "Case Brief Generator",
      path: "/case-brief",
      icon: Gavel,
    },
    {
      title: "Citation Tool",
      path: "/citation-tool",
      icon: BookmarkCheck,
    },
    {
      title: "Flashcards",
      path: "/flashcards",
      icon: Library,
    },
    {
      title: "Upload",
      path: "/upload",
      icon: Upload,
    },
  ];
  
  const secondaryMenuItems = [
    {
      title: "Landing Page",
      path: "/",
      icon: ExternalLink,
      external: true,
    },
    {
      title: "Resources",
      path: "/resources",
      icon: BookOpenCheck,
    },
    {
      title: "Achievements",
      path: "/achievements",
      icon: Award,
    },
    {
      title: "Help",
      path: "/help",
      icon: HelpCircle,
    }
  ];

  const handleNavigation = (path, external = false) => {
    if (external) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <Sidebar data-state={state}>
      <SidebarHeader className="py-6">
        <div className="flex items-center gap-2 px-4">
          <div className="neon-border rounded-full p-1.5 w-9 h-9 flex items-center justify-center bg-primary/10 floating">
            <span className="text-primary font-bold">L</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Legal<span className="text-primary">Aid</span></h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="sidebar-scrollbar">
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
          <SidebarGroupLabel>More</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    isActive={location.pathname === item.path} 
                    onClick={() => handleNavigation(item.path, item.external)}
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
          <p>© 2025 LegalAid</p>
          <p className="mt-1">Created by Zawad</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
