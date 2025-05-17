
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SettingsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Content for configuring your nutrition preferences and settings will go here.</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Here you'll be able to update dietary restrictions, goals,
          notification preferences related to nutrition, and other relevant settings.
        </p>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
