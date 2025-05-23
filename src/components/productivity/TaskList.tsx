
import React, { useState } from "react";
import { Loader2, Clock, XCircle, Calendar, Tag, Trash2, PencilIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StudyTask, TaskPriority } from "@/services/dataService";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditTaskModal from "./EditTaskModal";

type TaskListProps = {
  tasks: StudyTask[];
  isLoading: boolean;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onUpdateTask?: (task: StudyTask) => void;
};

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  isLoading, 
  toggleTaskCompletion, 
  onDeleteTask,
  onUpdateTask
}) => {
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Group tasks by priority
  const highPriorityTasks = tasks.filter(task => task.priority === 'high');
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium');
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low' || !task.priority);
  
  // Sort tasks within each priority group by due date
  const sortByDueDate = (a: StudyTask, b: StudyTask) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  };
  
  const sortedHighPriority = [...highPriorityTasks].sort(sortByDueDate);
  const sortedMediumPriority = [...mediumPriorityTasks].sort(sortByDueDate);
  const sortedLowPriority = [...lowPriorityTasks].sort(sortByDueDate);
  
  // Calculate completion statistics
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  // Get color for priority badges
  const getPriorityColor = (priority: TaskPriority | undefined) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-500 hover:bg-red-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-500 hover:bg-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30';
    }
  };
  
  // Get category badge color
  const getCategoryColor = (category: string | undefined) => {
    switch (category) {
      case 'homework':
        return 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30';
      case 'reading':
        return 'bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30';
      case 'research':
        return 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30';
      case 'preparation':
        return 'bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30';
      case 'exam':
        return 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30';
    }
  };

  const handleEditTask = (task: StudyTask) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleTaskUpdated = (updatedTask: StudyTask) => {
    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    }
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  // Render each task card
  const renderTask = (task: StudyTask) => (
    <div 
      key={task.id} 
      className={cn(
        "flex items-start space-x-3 p-4 rounded-md transition-colors border border-border/30",
        task.completed ? "bg-muted/20" : "bg-muted/10 hover:bg-muted/30"
      )}
    >
      <Checkbox 
        id={task.id} 
        checked={task.completed} 
        onCheckedChange={() => toggleTaskCompletion(task.id)}
        className="mt-1"
      />
      <div className="space-y-1 w-full">
        <div className="flex justify-between">
          <label 
            htmlFor={task.id}
            className={`text-base font-medium cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
          >
            {task.title}
          </label>
          
          <div className="flex space-x-1">
            {onUpdateTask && (
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => handleEditTask(task)}>
                <PencilIcon className="h-4 w-4" />
              </Button>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this task? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDeleteTask(task.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {task.description && (
          <p className={`text-sm ${task.completed ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}>
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {task.dueDate && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Calendar className="w-3 h-3" />
              {task.dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </Badge>
          )}
          
          {task.estimatedTime && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Clock className="w-3 h-3" />
              {task.estimatedTime} min
            </Badge>
          )}
          
          {task.priority && (
            <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          )}
          
          {task.category && (
            <Badge className={cn("text-xs", getCategoryColor(task.category))}>
              <Tag className="w-3 h-3 mr-1" />
              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center p-8">
            <XCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-medium text-lg mb-2">No tasks found</h3>
            <p className="text-muted-foreground">
              You don't have any tasks matching your filters. Try adjusting your filters or add a new task to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Progress Bar */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Task Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{completedTasks} of {totalTasks} tasks completed</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* High Priority Tasks */}
        {sortedHighPriority.length > 0 && (
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-red-500">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedHighPriority.map(renderTask)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medium Priority Tasks */}
        {sortedMediumPriority.length > 0 && (
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-amber-500">Medium Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedMediumPriority.map(renderTask)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Low Priority Tasks */}
        {sortedLowPriority.length > 0 && (
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-500">Low Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedLowPriority.map(renderTask)}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <EditTaskModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTaskUpdated={handleTaskUpdated}
        task={editingTask}
      />
    </>
  );
};

export default TaskList;
