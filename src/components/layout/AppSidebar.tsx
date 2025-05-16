
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

import CoreMenu from "./sidebar/CoreMenu";
import AccountMenu from "./sidebar/AccountMenu";
import UserProfile from "./sidebar/UserProfile";
import SidebarFooterContent from "./sidebar/SidebarFooter";

const AppSidebar = () => {
  const logoUrl = "/lovable-uploads/a250c362-9d68-403d-a105-c329a9435a47.png";
  const location = useLocation();
  
  // Hide logo on dashboard and auth pages
  const shouldShowLogo = !location.pathname.includes('/dashboard') && 
                          !location.pathname.includes('/login') &&
                          !location.pathname.includes('/auth');
  
  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <div className="flex items-center gap-2 px-4">
          {shouldShowLogo && (
            <div className="flex items-center justify-center">
              <img 
                src={logoUrl} 
                alt="BiomaAI Logo" 
                className="w-24 h-24 object-contain" 
                style={{ filter: 'brightness(1.2)' }}
              />
            </div>
          )}
          <h1 className="text-xl font-bold text-foreground">Bioma<span className="text-primary">AI</span></h1>
        </div>
        <UserProfile />
      </SidebarHeader>
      
      <SidebarContent className="sidebar-scrollbar">
        <CoreMenu />
        <SidebarSeparator className="my-2" />
        <AccountMenu />
      </SidebarContent>
      
      <SidebarFooter className="py-4">
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
