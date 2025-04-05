
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { CheckCircle2, Clock, CalendarClock } from "lucide-react";
import { StudyTask, dataService } from "@/services/dataService";

interface ProductivityStatsProps {
  tasks: StudyTask[];
}

const ProductivityStats: React.FC<ProductivityStatsProps> = ({ tasks }) => {
  const [studyTimeStats, setStudyTimeStats] = useState({
    tasksCompleted: 0,
    totalStudyTime: 0,
    averageSessionLength: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await dataService.getProductivityStats();
        setStudyTimeStats(stats);
      } catch (error) {
        console.error("Error fetching productivity stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Calculate task statistics by category
  const getCategoryStats = () => {
    const categories: Record<string, number> = {};
    
    tasks.forEach(task => {
      const category = task.category || 'other';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += 1;
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };
  
  // Calculate task completion by priority
  const getPriorityCompletionStats = () => {
    const stats = [
      { priority: 'High', completed: 0, total: 0 },
      { priority: 'Medium', completed: 0, total: 0 },
      { priority: 'Low', completed: 0, total: 0 }
    ];
    
    tasks.forEach(task => {
      const priority = task.priority || 'low';
      const index = priority === 'high' ? 0 : priority === 'medium' ? 1 : 2;
      
      stats[index].total += 1;
      if (task.completed) {
        stats[index].completed += 1;
      }
    });
    
    return stats;
  };
  
  const categoryStats = getCategoryStats();
  const priorityStats = getPriorityCompletionStats();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/20 p-3 mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{studyTimeStats.tasksCompleted}</h3>
              <p className="text-muted-foreground">Tasks Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/20 p-3 mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                {formatMinutes(studyTimeStats.totalStudyTime)}
              </h3>
              <p className="text-muted-foreground">Total Study Time</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/20 p-3 mb-4">
                <CalendarClock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                {formatMinutes(Math.round(studyTimeStats.averageSessionLength))}
              </h3>
              <p className="text-muted-foreground">Avg. Session Length</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Task Distribution Chart */}
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Task Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} tasks`, 'Count']}
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Task Completion by Priority */}
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Task Completion by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityStats}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="priority" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
                <Bar 
                  name="Completed" 
                  dataKey="completed" 
                  stackId="a" 
                  fill="#00C49F" 
                />
                <Bar 
                  name="Remaining" 
                  dataKey={(data) => data.total - data.completed} 
                  stackId="a" 
                  fill="#FF8042" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductivityStats;
