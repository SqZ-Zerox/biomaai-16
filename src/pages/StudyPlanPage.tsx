
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, CheckCircle, Clock, Pencil, PlusCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StudyTask {
  id: string;
  title: string;
  date: Date;
  duration: number; // in minutes
  completed: boolean;
  category: string;
}

const MOCK_TASKS: StudyTask[] = [
  {
    id: "t1",
    title: "Review Contract Law Cases",
    date: new Date(),
    duration: 60,
    completed: false,
    category: "Contract Law"
  },
  {
    id: "t2",
    title: "Practice Tort Questions",
    date: new Date(),
    duration: 45,
    completed: false,
    category: "Tort Law"
  },
  {
    id: "t3",
    title: "Read Criminal Law Chapter 5",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 90,
    completed: false,
    category: "Criminal Law"
  },
  {
    id: "t4",
    title: "Review Property Law Notes",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    duration: 60,
    completed: true,
    category: "Property Law"
  }
];

const StudyPlanPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<StudyTask[]>(MOCK_TASKS);

  const formattedDate = format(date, "MMMM d, yyyy");
  
  const todaysTasks = tasks.filter(task => 
    format(task.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );
  
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const pendingTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Study Plan</h1>
        <p className="text-muted-foreground">
          Your personalized study schedule
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calendar</CardTitle>
              <CardDescription>Select a date to view or edit your study tasks</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
                components={{
                  day: (props) => {
                    const dateStr = format(props.date, "yyyy-MM-dd");
                    const hasTask = tasks.some(task => format(task.date, "yyyy-MM-dd") === dateStr);
                    return (
                      <div 
                        className={cn(
                          hasTask && "relative",
                          props.selected && "bg-legal-primary text-primary-foreground"
                        )}
                      >
                        {props.day}
                        {hasTask && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-legal-secondary rounded-full" />
                        )}
                      </div>
                    );
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Tasks Pending</p>
                    <p className="text-2xl font-bold">{pendingTasksCount}</p>
                  </div>
                  <div className="bg-legal-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Tasks Completed</p>
                    <p className="text-2xl font-bold text-legal-primary">{completedTasksCount}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-muted-foreground">Overall Progress</span>
                    <span className="text-sm font-medium">
                      {Math.round((completedTasksCount / (pendingTasksCount + completedTasksCount)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-legal-primary"
                      style={{ width: `${(completedTasksCount / (pendingTasksCount + completedTasksCount)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-legal-primary" />
                  {formattedDate}
                </CardTitle>
                <CardDescription>
                  {todaysTasks.length} task{todaysTasks.length !== 1 ? 's' : ''} scheduled
                </CardDescription>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-4 w-4" /> Add
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="text-center p-2">
                    <p>In the full app, this would open a form to add new study tasks.</p>
                  </div>
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent>
              {todaysTasks.length > 0 ? (
                <div className="space-y-3">
                  {todaysTasks.map((task) => (
                    <div 
                      key={task.id}
                      className={cn(
                        "p-3 border rounded-lg flex justify-between items-start",
                        task.completed && "bg-legal-muted/50 border-legal-primary/30"
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <button 
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="mt-1"
                        >
                          {task.completed ? (
                            <CheckCircle className="h-5 w-5 text-legal-primary" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
                          )}
                        </button>
                        <div>
                          <p className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                            {task.title}
                          </p>
                          <div className="flex items-center mt-1">
                            <Badge variant="secondary" className="mr-2 text-xs">
                              {task.category}
                            </Badge>
                            <span className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" /> {task.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No tasks scheduled for this date.</p>
                  <Button className="mt-4" variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanPage;
