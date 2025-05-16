
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
  const logoUrl = "/lovable-uploads/df0476f6-6a0f-41e6-a14b-2abf89833186.png"; // Updated user uploaded image
  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <div className="flex items-center gap-2 px-4">
          {/* Updated logo container: removed neon-border, floating; added border; increased size */}
          <div className="border border-primary/30 rounded-lg p-1 w-16 h-16 flex items-center justify-center bg-card">
            <img src={logoUrl} alt="BiomaAI Logo" className="w-14 h-14 object-contain" /> {/* Increased size */}
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
