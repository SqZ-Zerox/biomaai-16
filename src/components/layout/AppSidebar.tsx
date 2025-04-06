
import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuLabel, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, MessageSquareText, BookOpen, Scale, Library, FileText, PenTool, CheckSquare, Upload, HelpCircle, Globe, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const mainMenuItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/chat", label: "AI Chat", icon: MessageSquareText, badge: "New" },
    { path: "/study", label: "Study Resources", icon: BookOpen },
    { path: "/study-plan", label: "Productivity Hub", icon: CheckSquare },
  ];
  
  const toolsMenuItems = [
    { path: "/case-brief", label: "Case Brief Generator", icon: Scale },
    { path: "/legal-essays", label: "Legal Essay Assistant", icon: FileText },
    { path: "/citation-tool", label: "Citation Tool", icon: PenTool },
    { path: "/flashcards", label: "Flashcards", icon: Library },
    { path: "/upload", label: "Upload Documents", icon: Upload },
  ];
  
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div 
            className="flex items-center gap-2 py-4 pl-4 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="globe w-8 h-8">
              <div className="w-full h-full rounded-full bg-primary/15 flex items-center justify-center">
                <Globe className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base leading-none">LegalAid</span>
              <span className="text-muted-foreground text-xs">Law School Assistant</span>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      active={isActive(item.path)}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs py-0 px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {toolsMenuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      active={isActive(item.path)}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                active={isActive("/settings")}
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <div className="px-3 py-2 mt-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start px-2 gap-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src="/avatars/avatar-1.png" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm">Jane Doe</span>
                <span className="text-xs text-muted-foreground">Law Student</span>
              </div>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarRail>
        <div className="flex flex-col items-center p-2 gap-1">
          {[...mainMenuItems, ...toolsMenuItems].map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="icon"
              className={cn("h-9 w-9", isActive(item.path) && "bg-primary/15 text-primary")}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          ))}
          
          <div className="border-t border-border w-full my-2" />
          
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", isActive("/settings") && "bg-primary/15 text-primary")}
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </SidebarRail>
    </>
  );
};

export default AppSidebar;
