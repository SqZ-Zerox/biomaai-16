
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, Award } from "lucide-react";

const ProgressTrackingPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div 
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background via-background to-primary/5 p-10 border border-border/40 shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-30 backdrop-blur-sm"></div>

        <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-primary/80 bg-clip-text text-transparent">
            Progress Tracking
          </h1>

          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Coming Soon
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Your personalized, gamified progress dashboard to track wellness goals, streaks, points, and milestones.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Goal Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Set personal wellness targets and visualize your journey with intuitive charts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Activity Streaks</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Build habits through consistent activity tracking and achievement streaks.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Unlock badges and rewards as you reach important health milestones.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <p className="text-muted-foreground text-sm mt-8">
            We're working hard to bring you a comprehensive progress tracking experience that will help you visualize your health journey and stay motivated to achieve your wellness goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackingPage;
