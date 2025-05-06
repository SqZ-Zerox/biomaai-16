
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Bell,
  HelpCircle,
  Award,
  User,
  Settings
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

const AccountMenu = () => {
  const { setOpenMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const menuItems = [
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
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Account</SidebarGroupLabel>
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

export default AccountMenu;
