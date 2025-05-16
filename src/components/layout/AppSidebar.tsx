
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
  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <div className="flex items-center gap-2 px-4">
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
