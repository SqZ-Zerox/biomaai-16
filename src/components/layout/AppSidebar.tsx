
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator
} from "@/components/ui/sidebar";

import CoreMenu from "./sidebar/CoreMenu";
import AccountMenu from "./sidebar/AccountMenu";
import UserProfile from "./sidebar/UserProfile";
import SidebarFooterContent from "./sidebar/SidebarFooter";

const AppSidebar = () => {
  const logoUrl = "/lovable-uploads/ad59829f-84fe-4b58-a803-a7a930074fb4.png"; // Updated with new logo
  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <div className="flex items-center gap-2 px-4">
          <div className="border border-primary/30 rounded-lg p-1 w-16 h-16 flex items-center justify-center bg-card">
            <img 
              src={logoUrl} 
              alt="BiomaAI Logo" 
              className="w-14 h-14 object-contain" 
              style={{ filter: 'brightness(1.2)' }} // Added brightness to improve visibility
            />
          </div>
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
