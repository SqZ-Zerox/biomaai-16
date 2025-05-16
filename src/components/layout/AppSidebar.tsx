
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
  const logoUrl = "/lovable-uploads/1fab83ec-4fc6-4b85-9376-3e87d9df2a46.png";
  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <div className="flex items-center gap-2 px-4">
          <div className="neon-border rounded-lg p-1 w-9 h-9 flex items-center justify-center bg-card floating">
            <img src={logoUrl} alt="BiomaAI Logo" className="w-7 h-7 object-contain" />
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
