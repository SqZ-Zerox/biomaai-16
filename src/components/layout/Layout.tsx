
import React from "react";
import Header from "./Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import BiomaBotButton from "../dashboard/BiomaBotButton";
import { useIsMobile } from "@/hooks/use-mobile";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, toggleDarkMode, isDarkMode }) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-background/80">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
          <main className="flex-1 overflow-y-auto pb-20">
            <div className="container mx-auto p-4">
              {children}
            </div>
          </main>
          <BiomaBotButton />
          <Navigation />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
