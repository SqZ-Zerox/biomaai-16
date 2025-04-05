
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { CheckCircle2, Clock, CalendarClock, Sparkles, Calendar, BarChart2, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { StudyTask, dataService } from "@/services/dataService";
import { format, subDays, isSameDay } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductivityStatsProps {
  tasks: StudyTask[];
}

const ProductivityStats: React.FC<ProductivityStatsProps> = ({ tasks }) => {
  const [studyTimeStats, setStudyTimeStats] = useState({
    tasksCompleted: 0,
    totalStudyTime: 0,
    averageSessionLength: 0
  });
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("week");
  const [dailyActivityData, setDailyActivityData] = useState<any[]>([]);
  const [goalCompletionData, setGoalCompletionData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await dataService.getProductivityStats();
        setStudyTimeStats(stats);
        
        // Generate sample daily activity data
        generateDailyActivityData();
        
        // Generate sample goal completion data
        generateGoalCompletionData();
      } catch (error) {
        console.error("Error fetching productivity stats:", error);
      }
    };

    fetchStats();
  }, [timeframe]);

  // Generate daily activity data based on the selected timeframe
  const generateDailyActivityData = () => {
    const days = timeframe === "week" ? 7 : timeframe === "month" ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      
      // Generate some sample data (in a real app, this would come from your backend)
      // Find completed tasks for this day
      const completedTasksToday = tasks.filter(task => 
        task.completed && task.dueDate && isSameDay(new Date(task.dueDate), date)
      ).length;
      
      data.push({
        date: format(date, "MMM dd"),
        studyTime: Math.floor(Math.random() * 120) + 30, // Random study time between 30-150 minutes
        tasks: completedTasksToday || Math.floor(Math.random() * 5), // Use actual data or random
        events: Math.floor(Math.random() * 3)
      });
    }
    
    setDailyActivityData(data);
  };

  // Generate goal completion data
  const generateGoalCompletionData = () => {
    const goals = [
      { name: "Study Time", completed: 80, target: 100 },
      { name: "Tasks", completed: 15, target: 20 },
      { name: "Focus Sessions", completed: 12, target: 15 },
      { name: "Flashcards", completed: 40, target: 50 }
    ];
    
    setGoalCompletionData(goals);
  };

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
  
  // Calculate task completion by due date (on time, late, etc.)
  const getCompletionTimingStats = () => {
    const now = new Date();
    let onTime = 0;
    let late = 0;
    let veryLate = 0;
    
    tasks.forEach(task => {
      if (task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const completionDate = new Date(); // In a real app, you'd store the actual completion date
        
        if (completionDate <= dueDate) {
          onTime += 1;
        } else {
          const daysDiff = Math.floor((completionDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff <= 2) {
            late += 1;
          } else {
            veryLate += 1;
          }
        }
      }
    });
    
    return [
      { name: "On Time", value: onTime },
      { name: "1-2 Days Late", value: late },
      { name: "3+ Days Late", value: veryLate }
    ];
  };
  
  const categoryStats = getCategoryStats();
  const priorityStats = getPriorityCompletionStats();
  const completionTimingStats = getCompletionTimingStats();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate most productive day based on completed tasks or study time
  const getMostProductiveDay = () => {
    if (dailyActivityData.length === 0) return "Not enough data";
    
    const mostProductiveDay = dailyActivityData.reduce((prev, current) => 
      (current.studyTime > prev.studyTime) ? current : prev
    );
    
    return mostProductiveDay.date;
  };

  // Calculate streak (consecutive days with activity)
  const getCurrentStreak = () => {
    // In a real app, this would be calculated from actual user activity data
    return 5; // Sample streak value
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle>Productivity Overview</CardTitle>
          <CardDescription>
            Track your productivity metrics and progress over time
          </CardDescription>
          <div className="flex justify-end">
            <Select value={timeframe} onValueChange={(value: "week" | "month" | "year") => setTimeframe(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/20 p-3 mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{studyTimeStats.tasksCompleted}</h3>
              <p className="text-muted-foreground">Tasks Completed</p>
              <Badge variant="outline" className="mt-2">
                {timeframe === "week" ? "This Week" : timeframe === "month" ? "This Month" : "This Year"}
              </Badge>
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
              <Badge variant="outline" className="mt-2 capitalize">
                {timeframe}ly Average
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/20 p-3 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">
                {getMostProductiveDay()}
              </h3>
              <p className="text-muted-foreground">Most Productive Day</p>
              <Badge variant="outline" className="mt-2">
                {getCurrentStreak()} Day Streak
              </Badge>
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
              <Badge variant="outline" className="mt-2 capitalize">
                Based on {studyTimeStats.tasksCompleted} Sessions
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Stats */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Activity
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" /> Categories
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" /> Goals
          </TabsTrigger>
        </TabsList>
        
        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Daily Activity</CardTitle>
              <CardDescription>
                Study time, completed tasks and events by day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyActivityData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(20, 20, 20, 0.8)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      name="Study Time (min)"
                      dataKey="studyTime"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      name="Tasks Completed"
                      dataKey="tasks"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      name="Events"
                      dataKey="events"
                      stroke="#ffc658"
                      fill="#ffc658"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Weekly Productivity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dailyActivityData.slice(-7)} // Last 7 days
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(20, 20, 20, 0.8)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        name="Study Time" 
                        dataKey="studyTime" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Reading', value: 35 },
                          { name: 'Writing', value: 25 },
                          { name: 'Research', value: 20 },
                          { name: 'Problem Solving', value: 15 },
                          { name: 'Other', value: 5 }
                        ]}
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
                        formatter={(value: number) => [`${value}%`, 'Time Spent']}
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
          </div>
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Legend />
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
            
            <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Completion Timing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={completionTimingStats}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {completionTimingStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : index === 1 ? '#FFBB28' : '#FF8042'} />
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
            
            <Card className="border-border/40 bg-card/60 backdrop-blur-sm md:col-span-2">
              <CardHeader>
                <CardTitle>Study Time vs Tasks Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dailyActivityData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(20, 20, 20, 0.8)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        name="Study Time" 
                        dataKey="studyTime" 
                        stroke="#8884d8" 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        name="Tasks Completed" 
                        dataKey="tasks" 
                        stroke="#82ca9d" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Category Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Homework', time: 320 },
                        { name: 'Reading', time: 480 },
                        { name: 'Research', time: 240 },
                        { name: 'Exams', time: 180 },
                        { name: 'Other', time: 120 }
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(20, 20, 20, 0.8)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                        formatter={(value) => [`${formatMinutes(Number(value))}`, 'Time Spent']}
                      />
                      <Bar 
                        dataKey="time" 
                        fill="#8884d8" 
                        name="Time Spent"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Goal Progress</CardTitle>
              <CardDescription>Track your progress toward weekly goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {goalCompletionData.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{goal.name}</span>
                    <span>{goal.completed}/{goal.target} ({Math.round((goal.completed/goal.target) * 100)}%)</span>
                  </div>
                  <Progress value={(goal.completed/goal.target) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {goal.target - goal.completed} more to reach your goal
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Historical Goal Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Week 1', completed: 75 },
                      { name: 'Week 2', completed: 85 },
                      { name: 'Week 3', completed: 65 },
                      { name: 'Week 4', completed: 90 },
                      { name: 'Week 5', completed: 80 }
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(20, 20, 20, 0.8)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                      formatter={(value) => [`${value}%`, 'Goal Completion']}
                    />
                    <Bar 
                      dataKey="completed" 
                      fill="#8884d8" 
                      name="Goal Completion (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductivityStats;
