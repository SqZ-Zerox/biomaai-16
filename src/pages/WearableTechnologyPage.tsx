
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Watch, Smartphone, Heart, LineChart, Laptop, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const WearableTechnologyPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div 
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background via-background to-primary/5 p-10 border border-border/40 shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-30 backdrop-blur-sm"></div>

        <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-primary/80 bg-clip-text text-transparent">
            Wearable Technology
          </h1>

          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Coming Soon
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Seamlessly connect your favorite fitness trackers and health devices to enhance your wellness journey with real-time data and insights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Watch className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Device Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect your smartwatches, fitness trackers, and health monitors for continuous health tracking.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Health Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track heart rate, sleep patterns, activity levels, stress, and other vital health metrics in one place.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Smart Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive AI-driven insights from your continuous health data to optimize your daily activities.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-lg p-6 text-left">
            <h3 className="text-xl font-semibold mb-3">Compatible Devices</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/40">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Watch className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">Apple Watch</div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/40">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Watch className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">Fitbit</div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/40">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Watch className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">Garmin</div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/40">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">Google Fit</div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/40">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">Samsung Health</div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/40">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Watch className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">Oura Ring</div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              And many more devices to be supported at launch.
            </p>
          </div>
          
          <div className="mt-8 bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-lg p-6 text-left">
            <h3 className="text-xl font-semibold mb-3">How It Will Work</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">Connect Your Device</p>
                  <p className="text-sm text-muted-foreground">Easily pair your wearable devices using our secure connection protocol. No technical expertise required.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">Automatic Syncing</p>
                  <p className="text-sm text-muted-foreground">Your health data syncs automatically in the background, ensuring your dashboard always shows the latest information.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">Comprehensive Dashboard</p>
                  <p className="text-sm text-muted-foreground">View all your wearable data alongside lab results and other health metrics in a unified dashboard.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <p className="font-medium">AI-Powered Insights</p>
                  <p className="text-sm text-muted-foreground">Receive personalized recommendations based on patterns detected in your continuous health data.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" className="bg-primary/5 border-primary/20 hover:bg-primary/10">
              <Laptop className="h-4 w-4 mr-2" />
              Learn More
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowRight className="h-4 w-4 mr-2" />
              Join Beta
            </Button>
          </div>

          <p className="text-muted-foreground text-sm mt-8">
            We're integrating with major wearable technology providers to bring you a seamless experience for monitoring your health in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WearableTechnologyPage;
