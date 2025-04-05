
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
  Bell,
  BarChart2,
  PlusCircle,
  Lightbulb,
  CheckSquare,
  BookOpenCheck,
  Target,
  Trophy
} from "lucide-react";
import { dataService, StudyTask, StudyEvent } from "@/services/dataService";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const navigate = useNavigate();
  const [recentTasks, setRecentTasks] = useState<StudyTask[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<StudyEvent[]>([]);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [totalTasksCount, setTotalTasksCount] = useState(0);
  const [studyTimeToday, setStudyTimeToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch tasks and events
        const tasksData = await dataService.getTasks();
        const eventsData = await dataService.getEvents();
        const statsData = await dataService.getProductivityStats();
        
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
        
        setRecentTasks(sortedTasks.slice(0, 5));
        setUpcomingEvents(upcoming.slice(0, 5));
        setCompletedTasksCount(tasksData.filter(t => t.completed).length);
        setTotalTasksCount(tasksData.length);
        setStudyTimeToday(statsData.totalStudyTime);
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

  // Format date with relative indicators (Today, Tomorrow, etc.)
  const formatDateWithRelative = (date: Date) => {
    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, "h:mm a")}`;
    } else if (isThisWeek(date)) {
      return format(date, "EEEE, h:mm a"); // e.g. "Monday, 2:30 PM"
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  // Format minutes into hours and minutes
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section with Quick Stats */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Welcome to LegalAid
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Your AI-powered study assistant for law school. Track tasks, manage events, and maximize your productivity.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/study-plan")} size="lg" className="gap-2">
              <Calendar className="h-5 w-5" /> Productivity Hub
            </Button>
            <Button variant="outline" onClick={() => navigate("/chat")} size="lg" className="gap-2">
              <MessageSquare className="h-5 w-5" /> Ask AI
            </Button>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="border-border/40 bg-white/90 dark:bg-card/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? "..." : `${completedTasksCount}/${totalTasksCount}`}
                </h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/40 bg-white/90 dark:bg-card/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Time Today</p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? "..." : formatMinutes(studyTimeToday)}
                </h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/40 bg-white/90 dark:bg-card/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? "..." : upcomingEvents.length}
                </h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/40 bg-white/90 dark:bg-card/60 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Focus Sessions</p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? "..." : "4"}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Left Column: Tasks and Events (5/7 width) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Priority Tasks */}
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Priority Tasks</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1" 
                    onClick={() => navigate("/study-plan?tab=tasks")}
                  >
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => navigate("/study-plan?tab=tasks&action=add")}
                  >
                    <PlusCircle className="h-4 w-4" /> Add
                  </Button>
                </div>
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
                      onClick={() => navigate("/study-plan?tab=tasks")}
                    >
                      <div className="flex items-start gap-3">
                        <div className="pt-1">
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm line-clamp-1">{task.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {task.dueDate && (
                              <p className="text-xs text-muted-foreground">
                                Due: {formatDateWithRelative(new Date(task.dueDate))}
                              </p>
                            )}
                            {task.estimatedTime && (
                              <p className="text-xs text-muted-foreground ml-1">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {task.estimatedTime} min
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.category && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {task.category}
                          </Badge>
                        )}
                        {task.priority && (
                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                            {task.priority}
                          </Badge>
                        )}
                      </div>
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
                    onClick={() => navigate("/study-plan?tab=tasks&action=add")}
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
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Upcoming Events</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1" 
                    onClick={() => navigate("/study-plan?tab=calendar")}
                  >
                    View Calendar <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => navigate("/study-plan?tab=calendar&action=add")}
                  >
                    <PlusCircle className="h-4 w-4" /> Add
                  </Button>
                </div>
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
                          <h3 className="font-medium text-sm line-clamp-1">{event.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDateWithRelative(new Date(event.date))}
                          </p>
                        </div>
                      </div>
                      {event.type && (
                        <Badge className={`${getEventTypeStyles(event.type)} text-xs`}>
                          {event.type}
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
                    onClick={() => navigate("/study-plan?tab=calendar&action=add")}
                  >
                    Add an event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stats & Quick Access (2/7 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Focus Timer */}
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
          
          {/* Progress Summary */}
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Progress</CardTitle>
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tasks Completion</span>
                  <span>{totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0}%</span>
                </div>
                <Progress 
                  value={totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Study Time Goal</span>
                  <span>{Math.min(Math.round((studyTimeToday / 120) * 100), 100)}%</span>
                </div>
                <Progress 
                  value={Math.min((studyTimeToday / 120) * 100, 100)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {formatMinutes(studyTimeToday)} of 2h daily goal
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => navigate("/study-plan?tab=stats")}
              >
                View Detailed Stats
              </Button>
            </CardContent>
          </Card>
          
          {/* Pro Tips */}
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pro Tips</CardTitle>
                <Lightbulb className="h-5 w-5 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-amber-500/10 rounded-md border border-amber-200/20">
                <h4 className="font-medium text-sm">Pomodoro Technique</h4>
                <p className="text-xs mt-1 text-muted-foreground">
                  Try studying in 25-minute intervals with 5-minute breaks to maintain focus and productivity.
                </p>
              </div>
              
              <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
                <h4 className="font-medium text-sm">Active Recall</h4>
                <p className="text-xs mt-1 text-muted-foreground">
                  Test yourself regularly instead of passive re-reading to improve memory retention.
                </p>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-muted-foreground"
                onClick={() => navigate("/chat")}
              >
                Ask AI for More Tips
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Access Tools */}
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Quick Access</CardTitle>
            <BookOpenCheck className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {quickTools.map((tool, index) => (
              <button
                key={index}
                onClick={() => navigate(tool.link)}
                className="flex flex-col items-center p-4 rounded-lg border border-border/40 bg-muted/5 hover:bg-muted/20 transition text-center gap-2"
              >
                <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-1">
                  {tool.icon}
                </div>
                <span className="font-medium text-sm">{tool.title}</span>
                <span className="text-xs text-muted-foreground">{tool.description}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Achievements</CardTitle>
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex flex-col items-center p-4 border border-border/40 rounded-lg bg-muted/5">
              <div className="rounded-full bg-amber-500/10 w-10 h-10 flex items-center justify-center mb-3">
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              <h4 className="font-medium">Early Bird</h4>
              <p className="text-xs text-muted-foreground mt-1">Studied before 8AM</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border border-border/40 rounded-lg bg-muted/5">
              <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-medium">Focus Master</h4>
              <p className="text-xs text-muted-foreground mt-1">4 focus sessions in a day</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border border-border/40 rounded-lg bg-muted/5">
              <div className="rounded-full bg-green-500/10 w-10 h-10 flex items-center justify-center mb-3">
                <CheckSquare className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="font-medium">Task Crusher</h4>
              <p className="text-xs text-muted-foreground mt-1">Completed 10 tasks</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border border-border/40 rounded-lg bg-muted/5">
              <div className="rounded-full bg-blue-500/10 w-10 h-10 flex items-center justify-center mb-3">
                <BookOpenCheck className="h-5 w-5 text-blue-500" />
              </div>
              <h4 className="font-medium">Knowledge Seeker</h4>
              <p className="text-xs text-muted-foreground mt-1">Created 5 flashcard decks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
