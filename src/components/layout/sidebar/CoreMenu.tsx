
import React from "react";
import { NavLink } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Home, Upload, ActivitySquare, Utensils, MessageCircle, TrendingUp } from "lucide-react";

const CoreMenu = () => {
  return (
    <div className="px-2">
      <p className="text-xs uppercase font-medium text-muted-foreground tracking-wider mb-2 px-2">
        Core
      </p>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink 
              to="/dashboard" 
              end  
              className={({ isActive }) => 
                `group flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-primary/10 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`
              }
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink 
              to="/upload" 
              className={({ isActive }) => 
                `group flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-primary/10 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`
              }
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink 
              to="/fitness" 
              className={({ isActive }) => 
                `group flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-primary/10 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`
              }
            >
              <ActivitySquare className="h-4 w-4" />
              <span>Fitness</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink 
              to="/nutrition" 
              className={({ isActive }) => 
                `group flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-primary/10 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`
              }
            >
              <Utensils className="h-4 w-4" />
              <span>Nutrition</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink 
              to="/chat" 
              className={({ isActive }) => 
                `group flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-primary/10 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`
              }
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink 
              to="/progress" 
              className={({ isActive }) => 
                `group flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-primary/10 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`
              }
            >
              <TrendingUp className="h-4 w-4" />
              <span>Progress Tracking</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};

export default CoreMenu;
