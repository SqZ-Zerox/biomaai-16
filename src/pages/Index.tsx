
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  MessageSquare,
  Calendar,
  Gavel,
  Library,
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle,
  BookmarkCheck,
  Bell
} from "lucide-react";
import { dataService, StudyTask, StudyEvent } from "@/services/dataService";
import { format } from "date-fns";

const Index = () => {
  const navigate = useNavigate();
  const [recentTasks, setRecentTasks] = useState<StudyTask[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<StudyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch tasks and events
        const tasksData = await dataService.getTasks();
        const eventsData = await dataService.getEvents();
        
        // Get incomplete tasks sorted by priority (high first)
        const sortedTasks = tasksData
          .filter(task => !task.completed)
          .sort((a, b) => {
            const priorityOrder: Record<string, number> = { high: 1, medium: 2, low: 3 };
            return (priorityOrder[a.priority || 'low'] || 3) - (priorityOrder[b.priority || 'low'] || 3);
          });
        
        // Get upcoming events
        const now = new Date();
        const upcoming = eventsData
          .filter(event => event.date > now)
          .sort((a, b) => a.date.getTime() - b.date.getTime());
        
        setRecentTasks(sortedTasks.slice(0, 3));
        setUpcomingEvents(upcoming.slice(0, 3));
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Quick access tools
  const quickTools = [
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: "Study Materials",
      description: "Access study resources",
      link: "/study",
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      title: "AI Chat",
      description: "Get instant answers",
      link: "/chat",
    },
    {
      icon: <Calendar className="h-5 w-5 text-primary" />,
      title: "Productivity Hub",
      description: "Manage tasks & events",
      link: "/study-plan",
    },
    {
      icon: <Gavel className="h-5 w-5 text-primary" />,
      title: "Case Brief",
      description: "Create case briefs",
      link: "/case-brief",
    },
    {
      icon: <Library className="h-5 w-5 text-primary" />,
      title: "Flashcards",
      description: "Study with flashcards",
      link: "/flashcards",
    },
    {
      icon: <BookmarkCheck className="h-5 w-5 text-primary" />,
      title: "Citations",
      description: "Generate citations",
      link: "/citation-tool",
    },
  ];

  // Function to get priority indicator
  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-500';
      case 'medium':
        return 'bg-amber-500/20 text-amber-500';
      case 'low':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Get event type style
  const getEventTypeStyles = (type: string | undefined) => {
    switch (type) {
      case 'exam':
        return "bg-red-500/20 text-red-500";
      case 'assignment':
        return "bg-amber-500/20 text-amber-500";
      case 'class':
        return "bg-primary/20 text-primary";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section with User Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Welcome to LegalAid
                </CardTitle>
                <CardDescription>
                  Your AI-powered study assistant for law school
                </CardDescription>
              </div>
              <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {quickTools.map((tool, index) => (
                <button
                  key={index}
                  onClick={() => navigate(tool.link)}
                  className="p-3 rounded-lg border border-border/40 bg-muted/5 hover:bg-muted/20 transition flex flex-col items-center text-center gap-1"
                >
                  <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center mb-2">
                    {tool.icon}
                  </div>
                  <span className="font-medium text-sm">{tool.title}</span>
                  <span className="text-xs text-muted-foreground">{tool.description}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Timer Card */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Quick Focus</CardTitle>
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => navigate("/study-plan?tab=focus&duration=15")}>
                  15 min
                </Button>
                <Button variant="outline" onClick={() => navigate("/study-plan?tab=focus&duration=25")}>
                  25 min
                </Button>
                <Button variant="outline" onClick={() => navigate("/study-plan?tab=focus&duration=50")}>
                  50 min
                </Button>
              </div>
              <Button className="w-full" onClick={() => navigate("/study-plan?tab=focus")}>
                Start Focus Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Tasks and Upcoming Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Tasks */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Priority Tasks</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/study-plan")}>
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-muted/20 rounded-md w-full"></div>
                  ))}
                </div>
              </div>
            ) : recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-start justify-between p-3 border border-border/30 rounded-md bg-muted/5 hover:bg-muted/10 transition cursor-pointer"
                    onClick={() => navigate("/study-plan")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{task.title}</h3>
                        {task.dueDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                    </div>
                    {task.priority && (
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No pending tasks</p>
                <Button
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate("/study-plan")}
                >
                  Add a task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/study-plan?tab=calendar")}>
                View Calendar <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-muted/20 rounded-md w-full"></div>
                  ))}
                </div>
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-start justify-between p-3 border border-border/30 rounded-md bg-muted/5 hover:bg-muted/10 transition cursor-pointer"
                    onClick={() => navigate("/study-plan?tab=calendar")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{event.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(event.date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    {event.type && (
                      <Badge className={getEventTypeStyles(event.type)}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No upcoming events</p>
                <Button
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate("/study-plan?tab=calendar")}
                >
                  Add an event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Study Resources Preview */}
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-3 px-6">
          <h2 className="text-lg font-medium">Quick Study Access</h2>
        </div>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button 
              variant="outline"
              className="h-auto py-3 flex flex-col items-center gap-2 justify-start"
              onClick={() => navigate("/case-brief")}
            >
              <Gavel className="h-5 w-5" />
              <span>Create New Case Brief</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-auto py-3 flex flex-col items-center gap-2 justify-start"
              onClick={() => navigate("/flashcards")}
            >
              <Library className="h-5 w-5" />
              <span>Study Flashcards</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-auto py-3 flex flex-col items-center gap-2 justify-start"
              onClick={() => navigate("/chat")}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Ask AI Assistant</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
