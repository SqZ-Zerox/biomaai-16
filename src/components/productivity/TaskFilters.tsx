
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { TaskCategory, TaskPriority } from "@/services/dataService";

interface TaskFiltersProps {
  priorityFilter: TaskPriority | 'all';
  setPriorityFilter: (value: TaskPriority | 'all') => void;
  categoryFilter: TaskCategory | 'all';
  setCategoryFilter: (value: TaskCategory | 'all') => void;
  showCompleted: boolean;
  setShowCompleted: (value: boolean) => void;
  resetFilters: () => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  showCompleted,
  setShowCompleted,
  resetFilters
}) => {
  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Filter Tasks</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters} 
          className="flex items-center gap-1"
        >
          <FilterX className="h-4 w-4" /> Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority-filter">Priority</Label>
          <Select 
            value={priorityFilter} 
            onValueChange={(value) => setPriorityFilter(value as TaskPriority | 'all')}
          >
            <SelectTrigger id="priority-filter">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category-filter">Category</Label>
          <Select 
            value={categoryFilter} 
            onValueChange={(value) => setCategoryFilter(value as TaskCategory | 'all')}
          >
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="homework">Homework</SelectItem>
              <SelectItem value="reading">Reading</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="preparation">Preparation</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 h-full pt-8">
          <Switch 
            id="show-completed" 
            checked={showCompleted} 
            onCheckedChange={setShowCompleted}
          />
          <Label htmlFor="show-completed">Show Completed Tasks</Label>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
