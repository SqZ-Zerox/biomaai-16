
import React, { useState, useEffect } from "react";
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
  Briefcase,
  PinIcon,
  Settings2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TestimonialCard from "@/components/home/TestimonialCard";
import FeatureCard from "@/components/home/FeatureCard";
import HeroSection from "@/components/home/HeroSection";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose,
  SheetFooter
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { SwitchButtons } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize from localStorage or use default features
  const [features, setFeatures] = useState(() => {
    const savedFeatures = localStorage.getItem('studyTools');
    return savedFeatures ? JSON.parse(savedFeatures) : [
      {
        icon: <Scale className="h-10 w-10 text-primary" />,
        title: "Case Brief Generator",
        description: "Transform complex legal cases into clear, concise briefs in seconds.",
        path: "/case-brief",
        isPinned: true,
        isVisible: true
      },
      {
        icon: <MessageSquare className="h-10 w-10 text-primary" />,
        title: "AI Legal Chat",
        description: "Get instant answers to your legal questions from our AI assistant.",
        path: "/chat",
        isPinned: false,
        isVisible: true
      },
      {
        icon: <FileText className="h-10 w-10 text-primary" />,
        title: "Legal Essay Assistant",
        description: "Write better legal essays with AI-powered suggestions and formatting.",
        path: "/legal-essays",
        isPinned: true,
        isVisible: true
      },
      {
        icon: <BookOpen className="h-10 w-10 text-primary" />,
        title: "Study Resources",
        description: "Access comprehensive study materials organized by legal subjects.",
        path: "/study",
        isPinned: false,
        isVisible: true
      },
      {
        icon: <Library className="h-10 w-10 text-primary" />,
        title: "Flashcards",
        description: "Master legal concepts with customizable flashcards and spaced repetition.",
        path: "/flashcards",
        isPinned: false,
        isVisible: true
      },
      {
        icon: <CheckSquare className="h-10 w-10 text-primary" />,
        title: "Productivity Hub",
        description: "Stay organized with task management tools designed for law students.",
        path: "/study-plan",
        isPinned: false,
        isVisible: true
      }
    ];
  });

  // Save to localStorage whenever features change
  useEffect(() => {
    localStorage.setItem('studyTools', JSON.stringify(features));
  }, [features]);

  // Handle dragging and reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(features);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setFeatures(items);
    toast({
      title: "Tools rearranged",
      description: "Your study tools have been reordered."
    });
  };

  const togglePinned = (index) => {
    const newFeatures = [...features];
    newFeatures[index].isPinned = !newFeatures[index].isPinned;
    setFeatures(newFeatures);
  };

  const toggleVisibility = (index) => {
    const newFeatures = [...features];
    newFeatures[index].isVisible = !newFeatures[index].isVisible;
    setFeatures(newFeatures);
  };

  // Reset to defaults
  const resetDefaults = () => {
    localStorage.removeItem('studyTools');
    window.location.reload();
  };

  // Show only visible features on the dashboard
  const visibleFeatures = features.filter(feature => feature.isVisible);

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
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Customize <Settings2 className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Customize Study Tools</SheetTitle>
                      <SheetDescription>
                        Reorder, pin, or hide study tools to customize your dashboard.
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="py-6">
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="toolsList">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2"
                            >
                              {features.map((feature, index) => (
                                <Draggable key={feature.title} draggableId={feature.title} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`flex items-center justify-between p-3 rounded-md border ${feature.isVisible ? 'bg-card' : 'bg-muted/30'}`}
                                    >
                                      <div className="flex items-center gap-3">
                                        {React.cloneElement(feature.icon, { 
                                          className: `h-5 w-5 ${feature.isVisible ? 'text-primary' : 'text-muted-foreground'}` 
                                        })}
                                        <span className={feature.isVisible ? '' : 'text-muted-foreground'}>
                                          {feature.title}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => togglePinned(index)}
                                        >
                                          <PinIcon 
                                            className={`h-4 w-4 ${feature.isPinned ? 'text-primary' : 'text-muted-foreground'}`} 
                                          />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => toggleVisibility(index)}
                                        >
                                          {feature.isVisible ? (
                                            <span className="text-green-500">✓</span>
                                          ) : (
                                            <X className="h-4 w-4 text-muted-foreground" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                      
                      <div className="mt-6">
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="text-green-500">✓</span> = Visible | 
                          <PinIcon className="h-3 w-3 inline mx-1 text-primary" /> = Pinned to top
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Drag and drop to reorder your tools.
                        </p>
                      </div>
                    </div>
                    
                    <SheetFooter className="flex flex-row justify-between sm:justify-between">
                      <Button variant="outline" onClick={resetDefaults}>
                        Reset to Default
                      </Button>
                      <SheetClose asChild>
                        <Button>Save Changes</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {/* Display pinned items first, then others */}
                {visibleFeatures
                  .sort((a, b) => {
                    if (a.isPinned === b.isPinned) return 0;
                    return a.isPinned ? -1 : 1;
                  })
                  .slice(0, 4)
                  .map((feature, index) => (
                    <FeatureCard 
                      key={index}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      onClick={() => navigate(feature.path)}
                      delay={index * 0.1}
                      isPinned={feature.isPinned}
                    />
                  ))}
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full" onClick={() => navigate("/study")}>
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
