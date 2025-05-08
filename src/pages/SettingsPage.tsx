
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OpenAISettings from "@/components/settings/OpenAISettings";
import GeminiSettings from "@/components/settings/GeminiSettings";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div>
          <Button 
            variant="ghost" 
            className="w-fit text-muted-foreground mb-6" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Settings className="mr-2 h-6 w-6 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your AI assistants and application preferences
          </p>
        </div>

        <Tabs defaultValue="api-keys" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="api-keys">AI Assistants</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api-keys" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">AI Configuration</h2>
              <p className="text-muted-foreground mb-6">
                Manage your AI assistant settings and API keys
              </p>
              
              <OpenAISettings />
              <GeminiSettings />
            </div>
          </TabsContent>
          
          <TabsContent value="account">
            <div className="p-8 text-center border rounded-md">
              <h2 className="text-lg font-medium mb-2">Account Settings</h2>
              <p className="text-muted-foreground">
                Account settings will be available in a future update.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance">
            <div className="p-8 text-center border rounded-md">
              <h2 className="text-lg font-medium mb-2">Appearance Settings</h2>
              <p className="text-muted-foreground">
                Appearance settings will be available in a future update.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
