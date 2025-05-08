
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, FileText, Apple, Dumbbell, LineChart, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BiomaBotButton from "@/components/dashboard/BiomaBotButton";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data
  const recentActivities = [
    { id: 1, type: "lab_upload", title: "Complete Blood Count", date: "2 days ago" },
    { id: 2, type: "nutrition", title: "Created Meal Plan", date: "1 week ago" },
    { id: 3, type: "fitness", title: "Updated Workout", date: "2 weeks ago" },
  ];
  
  const insightItems = [
    {
      title: "Optimize Vitamin D",
      description: "Your levels are slightly below optimal range",
      icon: <FileText className="h-5 w-5 text-amber-500" />,
      action: "View Details",
      route: "/health-insights"
    },
    {
      title: "Increase Protein Intake",
      description: "Recommended for your fitness goals",
      icon: <Apple className="h-5 w-5 text-green-500" />,
      action: "Plan Meals",
      route: "/nutrition"
    },
    {
      title: "Add Strength Training",
      description: "To improve metabolic rate",
      icon: <Dumbbell className="h-5 w-5 text-blue-500" />,
      action: "View Workouts",
      route: "/fitness"
    },
  ];
  
  return (
    <div className="container px-4 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to BIOMA</h1>
          <p className="text-muted-foreground">Your personal health optimization platform</p>
        </motion.div>
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Your Insights</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ActionCard 
                  title="Upload Lab Reports"
                  description="Get insights from your test results"
                  icon={<FileText className="h-6 w-6 text-primary" />}
                  onClick={() => navigate("/upload")}
                />
                <ActionCard 
                  title="Create Nutrition Plan"
                  description="Personalized meal planning"
                  icon={<Apple className="h-6 w-6 text-primary" />}
                  onClick={() => navigate("/nutrition")}
                />
                <ActionCard 
                  title="Build Fitness Routine"
                  description="Workout plans for your goals"
                  icon={<Dumbbell className="h-6 w-6 text-primary" />}
                  onClick={() => navigate("/fitness")}
                />
              </div>
            </motion.div>
            
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <Card className="bg-card border border-border/40">
                <CardContent className="pt-6">
                  {recentActivities.length > 0 ? (
                    <ul className="space-y-4">
                      {recentActivities.map((activity) => (
                        <li key={activity.id} className="flex items-center justify-between pb-4 border-b border-border/30 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-md ${
                              activity.type === "lab_upload" ? "bg-blue-100 dark:bg-blue-900/30" :
                              activity.type === "nutrition" ? "bg-green-100 dark:bg-green-900/30" :
                              "bg-orange-100 dark:bg-orange-900/30"
                            }`}>
                              {activity.type === "lab_upload" && <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                              {activity.type === "nutrition" && <Apple className="h-4 w-4 text-green-600 dark:text-green-400" />}
                              {activity.type === "fitness" && <Dumbbell className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-xs">
                            View
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent activity</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Get Started
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Health Progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Health Progress</h2>
                <Button variant="ghost" size="sm" className="text-primary">
                  View Reports
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <Card className="bg-card border border-border/40">
                <CardContent className="pt-6 pb-4">
                  <div className="flex items-center justify-center h-[200px] mb-2">
                    <LineChart className="h-32 w-32 text-muted-foreground opacity-25" />
                  </div>
                  <p className="text-center text-muted-foreground text-sm">
                    Upload lab reports to see your health trends over time
                  </p>
                  <div className="flex justify-center mt-4">
                    <Button onClick={() => navigate("/upload")}>
                      Upload Lab Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Insights Tab */}
          <TabsContent value="insights" className="mt-0 space-y-6">
            {insightItems.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Your Health Insights</h2>
                  <Card className="border border-border/40 bg-primary/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Overall Assessment</CardTitle>
                      <CardDescription>
                        Based on your most recent lab reports and health data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                        <p className="font-medium">Good, with room for improvement</p>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Your health markers are generally within normal ranges, but there are a few areas
                        that could be optimized for better overall health and performance.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <h3 className="text-lg font-medium mb-3">Recommended Focus Areas</h3>
                <div className="space-y-4">
                  {insightItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Card className="border border-border/40 hover:border-primary/20 transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-md bg-muted/50">
                                {item.icon}
                              </div>
                              <div>
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(item.route)}
                              className="whitespace-nowrap"
                            >
                              {item.action}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No insights yet</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Upload your lab reports or complete your health profile to get personalized insights and recommendations
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button onClick={() => navigate("/upload")}>
                    Upload Lab Reports
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/settings")}>
                    Complete Health Profile
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating bot button */}
      <BiomaBotButton />
    </div>
  );
};

// Helper component for action cards
const ActionCard = ({ title, description, icon, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1 border-border/40 hover:border-primary/20"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-primary/10 rounded-full mb-4">
            {icon}
          </div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <Button variant="ghost" size="sm" className="text-primary">
            Go <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
