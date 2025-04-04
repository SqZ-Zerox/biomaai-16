
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const StudyPlanPage = () => {
  const navigate = useNavigate();
  const [date, setDate] = React.useState<Date>(new Date());
  
  // Mock data for the study plan
  const mockTasks = [
    { id: "task1", title: "Read Chapter 5: Constitutional Law", completed: false },
    { id: "task2", title: "Review case notes: Brown v. Board of Education", completed: true },
    { id: "task3", title: "Practice essay questions on Property Law", completed: false },
    { id: "task4", title: "Create flashcards for Legal Terms", completed: false },
    { id: "task5", title: "Watch lecture on Criminal Procedure", completed: true },
  ];

  // Mock data for important dates
  const importantDates = [
    { date: new Date(2025, 3, 12), title: "Constitutional Law Exam" },
    { date: new Date(2025, 3, 15), title: "Property Law Assignment Due" },
    { date: new Date(2025, 3, 20), title: "Criminal Law Mock Trial" },
  ];

  const toggleTaskCompletion = (taskId: string) => {
    // This would update the state in a real application
    console.log(`Toggling task ${taskId}`);
  };

  // Function to highlight important dates on the calendar
  const isDayMarked = (day: Date) => {
    return importantDates.some(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear()
    );
  };

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
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
              modifiers={{
                marked: (date) => isDayMarked(date),
              }}
              modifiersClassNames={{
                marked: "bg-legal-primary/20 text-accent font-bold",
              }}
            />
            
            <div className="mt-4 space-y-2">
              <h3 className="font-medium text-lg">Important Dates</h3>
              {importantDates.map((event, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-2 rounded-md",
                    date && 
                    event.date.getDate() === date.getDate() && 
                    event.date.getMonth() === date.getMonth() && 
                    event.date.getFullYear() === date.getFullYear()
                    ? "bg-legal-primary/20 neon-border"
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
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {mockTasks.map((task) => (
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
                  Completed {mockTasks.filter(t => t.completed).length} of {mockTasks.length} tasks
                </p>
                <div className="w-full bg-muted/30 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-legal-accent" 
                    style={{
                      width: `${(mockTasks.filter(t => t.completed).length / mockTasks.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyPlanPage;
