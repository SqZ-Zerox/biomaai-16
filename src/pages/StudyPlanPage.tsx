
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertTriangle, Clock, PlusCircle, BarChart2, CalendarDays, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { dataService, StudyTask, StudyEvent } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import TaskList from "@/components/productivity/TaskList";
import StudyTimer from "@/components/productivity/StudyTimer";
import AddTaskModal from "@/components/productivity/AddTaskModal";
import EventsList from "@/components/productivity/EventsList";
import ProductivityStats from "@/components/productivity/ProductivityStats";

const ProductivityHubPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
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
        console.error("Error loading productivity data:", error);
        setIsError(true);
        toast({
          title: "Error Loading Data",
          description: "Failed to load your productivity data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTasks(false);
        setIsLoadingEvents(false);
      }
    };

    fetchData();
  }, [toast]);

  // Function to highlight important dates on the calendar
  const isDayMarked = (day: Date) => {
    return events.some(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear()
    );
  };

  const handleTaskAdded = (newTask: StudyTask) => {
    setTasks([...tasks, newTask]);
    toast({
      title: "Task Added",
      description: `"${newTask.title}" has been added to your tasks.`
    });
  };

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

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-6">Productivity Hub</h1>
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <CardTitle>Error Loading Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Failed to load your productivity data. Please try again later.</p>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productivity Hub</h1>
        <Button onClick={() => setIsAddTaskModalOpen(true)} className="gap-2">
          <PlusCircle className="h-4 w-4" /> Add Task
        </Button>
      </div>
      
      <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> Calendar
          </TabsTrigger>
          <TabsTrigger value="focus" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Focus Timer
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Statistics
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <TaskList 
              tasks={tasks} 
              isLoading={isLoadingTasks} 
              toggleTaskCompletion={toggleTaskCompletion}
            />
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                )}
              </CardContent>
            </Card>

            <EventsList 
              events={events} 
              isLoading={isLoadingEvents}
              selectedDate={date}
            />
          </div>
        </TabsContent>

        {/* Focus Timer Tab */}
        <TabsContent value="focus" className="mt-0">
          <StudyTimer />
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="mt-0">
          <ProductivityStats tasks={tasks} />
        </TabsContent>
      </Tabs>

      <AddTaskModal 
        isOpen={isAddTaskModalOpen} 
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
};

export default ProductivityHubPage;
