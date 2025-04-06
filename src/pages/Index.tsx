
import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  GraduationCap, 
  Scale, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  CheckSquare, 
  Library,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TestimonialCard from "@/components/home/TestimonialCard";
import FeatureCard from "@/components/home/FeatureCard";
import HeroSection from "@/components/home/HeroSection";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Scale className="h-10 w-10 text-primary" />,
      title: "Case Brief Generator",
      description: "Transform complex legal cases into clear, concise briefs in seconds.",
      path: "/case-brief",
      usageCount: 8,
      isPinned: true
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "AI Legal Chat",
      description: "Get instant answers to your legal questions from our AI assistant.",
      path: "/chat",
      usageCount: 12,
      isPinned: false
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Legal Essay Assistant",
      description: "Write better legal essays with AI-powered suggestions and formatting.",
      path: "/legal-essays",
      usageCount: 5,
      isPinned: true
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Study Resources",
      description: "Access comprehensive study materials organized by legal subjects.",
      path: "/study",
      usageCount: 15,
      isPinned: false
    },
    {
      icon: <Library className="h-10 w-10 text-primary" />,
      title: "Flashcards",
      description: "Master legal concepts with customizable flashcards and spaced repetition.",
      path: "/flashcards",
      usageCount: 7,
      isPinned: false
    },
    {
      icon: <CheckSquare className="h-10 w-10 text-primary" />,
      title: "Productivity Hub",
      description: "Stay organized with task management tools designed for law students.",
      path: "/study-plan",
      usageCount: 10,
      isPinned: false
    }
  ];

  // Recent activity - this would typically come from a backend API
  const recentActivity = [
    {
      title: "Created Case Brief",
      description: "Roe v. Wade - Constitutional Law",
      time: "2 hours ago",
      icon: <Scale className="h-4 w-4 text-green-500" />,
      iconBg: "bg-green-500/10",
    },
    {
      title: "Completed Flashcard Set",
      description: "Criminal Law - Mens Rea",
      time: "Yesterday",
      icon: <Library className="h-4 w-4 text-blue-500" />,
      iconBg: "bg-blue-500/10",
    },
    {
      title: "Added Task",
      description: "Complete Torts assignment",
      time: "2 days ago",
      icon: <CheckSquare className="h-4 w-4 text-amber-500" />,
      iconBg: "bg-amber-500/10",
    }
  ];

  // Upcoming deadlines
  const upcomingDeadlines = [
    {
      title: "Constitutional Law Essay",
      dueDate: "Tomorrow",
      priority: "high"
    },
    {
      title: "Contract Law Reading",
      dueDate: "In 3 days",
      priority: "medium"
    },
    {
      title: "Mock Trial Preparation",
      dueDate: "Next Week",
      priority: "low"
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Hero Section - Simplified for home page */}
      <HeroSection />
      
      {/* Main dashboard content */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Tools */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tools section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <motion.h2 
                  className="text-2xl font-bold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  My Study Tools
                </motion.h2>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => {}}>
                  Customize <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {features.slice(0, 4).map((feature, index) => (
                  <FeatureCard 
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    onClick={() => navigate(feature.path)}
                    delay={index * 0.1}
                    usageCount={feature.usageCount}
                    isPinned={feature.isPinned}
                  />
                ))}
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full" onClick={() => {}}>
                  View All Tools
                </Button>
              </div>
            </div>
            
            {/* Recent Case Briefs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Case Briefs</CardTitle>
                  <CardDescription>Your most recently created briefs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Roe v. Wade", "Brown v. Board of Education", "Miranda v. Arizona"].map((caseName, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center`}>
                            <Scale className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{caseName}</p>
                            <p className="text-xs text-muted-foreground">Constitutional Law</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/case-brief")}>
                    Create New Brief
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
          
          {/* Right column - Activity and Progress */}
          <div className="space-y-8">
            {/* Study Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Study Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Weekly Goal</span>
                        <span className="font-medium">70%</span>
                      </div>
                      <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 pt-2">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                        <div key={i} className="text-center">
                          <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs ${i < 5 ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted-foreground"}`}>
                            {day}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-2 text-sm text-center text-muted-foreground">
                      <span className="font-medium text-foreground">5-day</span> study streak! 🔥
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/study")}>
                    View Study Plan
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Upcoming Deadlines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                        <div className={`w-2 h-full min-h-[2.5rem] rounded-full 
                          ${deadline.priority === 'high' ? 'bg-red-500' : 
                            deadline.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`}>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{deadline.title}</p>
                          <p className="text-xs text-muted-foreground">Due: {deadline.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/study-plan")}>
                    View All Tasks
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                        <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                          {activity.icon}
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Quick Access Section */}
      <section className="container mx-auto px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-primary/5 border border-primary/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 bg-card hover:bg-card/80"
              onClick={() => navigate("/chat")}
            >
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <span>Ask AI</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 bg-card hover:bg-card/80"
              onClick={() => navigate("/case-brief")}
            >
              <Scale className="h-8 w-8 text-primary mb-2" />
              <span>Case Brief</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 bg-card hover:bg-card/80"
              onClick={() => navigate("/flashcards")}
            >
              <Library className="h-8 w-8 text-primary mb-2" />
              <span>Flashcards</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 bg-card hover:bg-card/80"
              onClick={() => navigate("/study-plan")}
            >
              <CheckSquare className="h-8 w-8 text-primary mb-2" />
              <span>Tasks</span>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
