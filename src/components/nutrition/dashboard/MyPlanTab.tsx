
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MyPlanTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Nutrition Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Content for managing and viewing your nutrition plan will go here.</p>
        <p className="mt-4 text-sm text-muted-foreground">
          This is where you'll see your daily/weekly meal breakdowns,
          and potentially initiate the plan creation process if no plan exists.
        </p>
      </CardContent>
    </Card>
  );
};

export default MyPlanTab;
