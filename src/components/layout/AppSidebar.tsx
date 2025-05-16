
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
  const logoUrl = "/lovable-uploads/7ed765e5-cc7e-4858-8e87-02755c946f2a.png"; // User uploaded image
  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <div className="flex items-center gap-2 px-4">
          <div className="neon-border rounded-lg p-1 w-12 h-12 flex items-center justify-center bg-card floating"> {/* Increased size w-10->w-12, h-10->h-12 */}
            <img src={logoUrl} alt="BiomaAI Logo" className="w-10 h-10 object-contain" /> {/* Increased size w-8->w-10, h-8->h-10 */}
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

