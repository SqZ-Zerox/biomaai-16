
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Clock, PlusCircle, BarChart2, CalendarDays, ListTodo, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { dataService, StudyTask, StudyEvent, TaskCategory, TaskPriority } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import TaskList from "@/components/productivity/TaskList";
import StudyTimer from "@/components/productivity/StudyTimer";
import AddTaskModal from "@/components/productivity/AddTaskModal";
import EventsList from "@/components/productivity/EventsList";
import AddEventModal from "@/components/productivity/AddEventModal";
import TaskFilters from "@/components/productivity/TaskFilters";
import ProductivityStats from "@/components/productivity/ProductivityStats";

const ProductivityHubPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const { toast } = useToast();
  
  // Filter states
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  
  // Reset filters
  const resetFilters = () => {
    setPriorityFilter('all');
    setCategoryFilter('all');
    setShowCompleted(false);
  };
  
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

  // Apply filters to tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by completion status
    if (!showCompleted && task.completed) return false;
    
    // Filter by priority
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
    
    return true;
  });

  const handleTaskAdded = (newTask: StudyTask) => {
    setTasks([...tasks, newTask]);
    toast({
      title: "Task Added",
      description: `"${newTask.title}" has been added to your tasks.`
    });
  };

  const handleEventAdded = (newEvent: StudyEvent) => {
    setEvents([...events, newEvent]);
    toast({
      title: "Event Added",
      description: `"${newEvent.title}" has been added to your calendar.`
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

  const handleDeleteTask = async (taskId: string) => {
    try {
      await dataService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Task Deleted",
        description: "The task has been removed.",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCalendarDateClick = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      // Check if there are events on this date
      const eventsOnDate = events.filter(
        event => 
          event.date.getDate() === newDate.getDate() &&
          event.date.getMonth() === newDate.getMonth() &&
          event.date.getFullYear() === newDate.getFullYear()
      );
      
      // If clicking a date, switch to calendar tab to show events for that date
      setActiveTab("calendar");
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
        <div className="flex gap-2">
          {activeTab === "calendar" ? (
            <Button onClick={() => setIsAddEventModalOpen(true)} className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Event
            </Button>
          ) : (
            <Button onClick={() => setIsAddTaskModalOpen(true)} className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Task
            </Button>
          )}
        </div>
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
          <TaskFilters
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            resetFilters={resetFilters}
          />
          
          <div className="grid grid-cols-1 gap-6">
            <TaskList 
              tasks={filteredTasks} 
              isLoading={isLoadingTasks} 
              toggleTaskCompletion={toggleTaskCompletion}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsAddEventModalOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" /> Event
                </Button>
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
                    onSelect={handleCalendarDateClick}
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
      
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onEventAdded={handleEventAdded}
        selectedDate={date}
      />
    </div>
  );
};

export default ProductivityHubPage;
