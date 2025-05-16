
import React from "react";
import { NavLink } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { 
  Home, Upload, ActivitySquare, Utensils, MessageCircle, 
  TrendingUp, Dna, Watch, Badge as LucideBadgeIcon // Renamed to avoid conflict if needed, though Badge component is from ui
} from "lucide-react";
import { Badge } from "@/components/ui/badge"; // This is the Badge component for UI

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

        {/* Corrected Genetic Analysis Item */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink 
              to="/genetic-analysis" 
              className={({ isActive }) => 
                `group flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-primary/10 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`
              }
            >
              <Dna className="h-4 w-4" />
              <span>Genetic Analysis</span>
              <Badge variant="outline" className="ml-1 py-0 h-5 bg-primary/10 text-primary text-xs">Soon</Badge>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* Corrected Wearable Tech Item */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <NavLink 
              to="/wearable" 
              className={({ isActive }) => 
                `group flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-primary/10 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`
              }
            >
              <Watch className="h-4 w-4" />
              <span>Wearable Tech</span>
              <Badge variant="outline" className="ml-1 py-0 h-5 bg-primary/10 text-primary text-xs">Soon</Badge>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};

export default CoreMenu;

