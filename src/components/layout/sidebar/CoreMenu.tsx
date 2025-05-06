
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  MessageCircle, 
  FileText,
  HeartPulse,
  Apple,
  Dumbbell
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const CoreMenu = () => {
  const { setOpenMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
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
  );
};

export default CoreMenu;
