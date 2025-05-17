
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, BarChart3, Settings as SettingsIcon } from 'lucide-react'; // Renamed to avoid conflict
import MyPlanTab from './dashboard/MyPlanTab';
import ProgressTab from './dashboard/ProgressTab';
import SettingsTab from './dashboard/SettingsTab';

const NutritionDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nutrition Hub</h1>
      <Tabs defaultValue="my-plan" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:max-w-md mb-6">
          <TabsTrigger value="my-plan">
            <ClipboardList className="mr-2 h-4 w-4" />
            My Plan
          </TabsTrigger>
          <TabsTrigger value="progress">
            <BarChart3 className="mr-2 h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-plan">
          <MyPlanTab />
        </TabsContent>
        <TabsContent value="progress">
          <ProgressTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionDashboard;
