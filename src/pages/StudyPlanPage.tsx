
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dataService, StudyTask, StudyEvent } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

const StudyPlanPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();
  
  // Fetch tasks and events on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingTasks(true);
        setIsLoadingEvents(true);
        
        // Fetch tasks
        const tasksData = await dataService.getTasks();
        setTasks(tasksData);
        
        // Fetch events
        const eventsData = await dataService.getEvents();
        setEvents(eventsData);
        
        setIsError(false);
      } catch (error) {
        console.error("Error loading study plan data:", error);
        setIsError(true);
        toast({
          title: "Error Loading Data",
          description: "Failed to load your study plan. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTasks(false);
        setIsLoadingEvents(false);
      }
    };

    fetchData();
  }, [toast]);

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const updatedTask = await dataService.toggleTaskCompletion(taskId);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      
      toast({
        title: updatedTask.completed ? "Task Completed" : "Task Marked Incomplete",
        description: updatedTask.title,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to highlight important dates on the calendar
  const isDayMarked = (day: Date) => {
    return events.some(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear()
    );
  };

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-6">Study Plan</h1>
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <CardTitle>Error Loading Study Plan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Failed to load your study plan data. Please try again later.</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Study Plan</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingEvents ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="rounded-md border"
                  modifiers={{
                    marked: (date) => isDayMarked(date),
                  }}
                  modifiersClassNames={{
                    marked: "bg-primary/20 text-primary font-bold",
                  }}
                />
                
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium text-lg">Important Dates</h3>
                  {events.map((event, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "p-2 rounded-md",
                        date && 
                        event.date.getDate() === date.getDate() && 
                        event.date.getMonth() === date.getMonth() && 
                        event.date.getFullYear() === date.getFullYear()
                        ? "bg-primary/20 neon-border"
                        : "bg-muted/30"
                      )}
                    >
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      {event.description && <p className="mt-1 text-sm">{event.description}</p>}
                      <span className={cn(
                        "inline-block mt-2 text-xs px-2 py-0.5 rounded-full",
                        event.type === "exam" ? "bg-red-500/20 text-red-500" :
                        event.type === "assignment" ? "bg-amber-500/20 text-amber-500" :
                        event.type === "class" ? "bg-primary/20 text-primary" :
                        "bg-gray-500/20 text-gray-500"
                      )}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Daily Tasks */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              Study Tasks for {date.toLocaleDateString('en-US', {
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTasks ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-start space-x-3 p-3 rounded-md transition-colors hover:bg-muted/30"
                  >
                    <Checkbox 
                      id={task.id} 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    <label 
                      htmlFor={task.id}
                      className={`text-base cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </label>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-border/40 mt-6">
                  <p className="text-muted-foreground">
                    Completed {tasks.filter(t => t.completed).length} of {tasks.length} tasks
                  </p>
                  <div className="w-full bg-muted/30 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{
                        width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyPlanPage;
