
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  PlayCircle, 
  PauseCircle, 
  RefreshCw, 
  Volume2, 
  VolumeX,
  CheckCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StudyTask, dataService } from "@/services/dataService";
import { cn } from "@/lib/utils";

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const StudyTimer: React.FC = () => {
  // Timer settings
  const [focusDuration, setFocusDuration] = useState(25); // minutes
  const [shortBreakDuration, setShortBreakDuration] = useState(5); // minutes
  const [longBreakDuration, setLongBreakDuration] = useState(15); // minutes
  
  // Timer state
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  // Session tracking
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  
  const { toast } = useToast();

  // Load tasks when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoadingTasks(true);
        const tasksData = await dataService.getTasks();
        // Filter out completed tasks
        setTasks(tasksData.filter(task => !task.completed));
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTasks(false);
      }
    };
    
    fetchTasks();
  }, [toast]);

  // Update timeLeft when mode or duration changes
  useEffect(() => {
    const durations = {
      focus: focusDuration,
      shortBreak: shortBreakDuration,
      longBreak: longBreakDuration
    };
    setTimeLeft(durations[mode] * 60);
  }, [mode, focusDuration, shortBreakDuration, longBreakDuration]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer finished
      handleTimerComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    // Play sound if not muted
    if (!isMuted) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();
    }
    
    if (mode === 'focus') {
      // End the current study session if there is one
      if (currentSessionId) {
        try {
          await dataService.endSession(currentSessionId, sessionNotes);
          setCurrentSessionId(null);
        } catch (error) {
          console.error("Error ending session:", error);
        }
      }
      
      // Increment completed sessions count
      const newCompletedSessions = completedFocusSessions + 1;
      setCompletedFocusSessions(newCompletedSessions);
      
      toast({
        title: "Focus Session Completed",
        description: "Great job! Take a break now.",
      });
      
      // Determine which break type to use next
      if (newCompletedSessions % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      // Break timer finished
      toast({
        title: "Break Time Over",
        description: "Ready to focus again?",
      });
      setMode('focus');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = async () => {
    setIsRunning(true);
    
    // Only start a session if we're in focus mode and don't already have an active session
    if (mode === 'focus' && !currentSessionId) {
      try {
        const newSession = await dataService.startSession(selectedTaskId);
        setCurrentSessionId(newSession.id);
        
        toast({
          title: "Session Started",
          description: selectedTaskId 
            ? `Working on selected task` 
            : `Focus timer started`,
        });
      } catch (error) {
        console.error("Error starting session:", error);
        toast({
          title: "Error",
          description: "Failed to start session tracking. Timer will continue.",
        });
      }
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = async () => {
    setIsRunning(false);
    
    // Reset time based on current mode
    const durations = {
      focus: focusDuration,
      shortBreak: shortBreakDuration,
      longBreak: longBreakDuration
    };
    setTimeLeft(durations[mode] * 60);
    
    // If resetting during focus mode with an active session, end the session
    if (mode === 'focus' && currentSessionId) {
      try {
        await dataService.endSession(currentSessionId, sessionNotes);
        setCurrentSessionId(null);
        setSessionNotes('');
        
        toast({
          title: "Session Ended",
          description: "Your study session has been saved.",
        });
      } catch (error) {
        console.error("Error ending session:", error);
      }
    }
  };

  const calculateProgress = () => {
    const durations = {
      focus: focusDuration * 60,
      shortBreak: shortBreakDuration * 60,
      longBreak: longBreakDuration * 60
    };
    const totalSeconds = durations[mode];
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Focus Timer</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "text-xs", 
                  mode === 'focus' ? "bg-primary/20" : ""
                )}
                onClick={() => setMode('focus')}
              >
                Focus
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "text-xs", 
                  mode === 'shortBreak' ? "bg-primary/20" : ""
                )}
                onClick={() => setMode('shortBreak')}
              >
                Short Break
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "text-xs", 
                  mode === 'longBreak' ? "bg-primary/20" : ""
                )}
                onClick={() => setMode('longBreak')}
              >
                Long Break
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-2">
          <div className="relative w-64 h-64 flex items-center justify-center mb-6">
            {/* Circular progress indicator */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted/20"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                className={cn(
                  "text-primary transition-all duration-500",
                  mode === 'shortBreak' && "text-green-500",
                  mode === 'longBreak' && "text-blue-500"
                )}
                strokeDasharray={`${(2 * Math.PI * 45 * calculateProgress()) / 100} ${
                  2 * Math.PI * 45
                }`}
              />
            </svg>
            
            {/* Timer display */}
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-bold mb-1">{formatTime(timeLeft)}</span>
              <Badge variant="secondary" className="capitalize">
                {mode === 'shortBreak' ? 'Short Break' : mode === 'longBreak' ? 'Long Break' : 'Focus Time'}
              </Badge>
            </div>
          </div>
          
          {/* Timer controls */}
          <div className="flex gap-4 items-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full w-12 h-12 p-0" 
              onClick={resetTimer}
            >
              <RefreshCw />
            </Button>
            
            {isRunning ? (
              <Button 
                size="lg" 
                className="rounded-full w-16 h-16 p-0" 
                onClick={pauseTimer}
              >
                <PauseCircle className="h-8 w-8" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="rounded-full w-16 h-16 p-0" 
                onClick={startTimer}
              >
                <PlayCircle className="h-8 w-8" />
              </Button>
            )}
            
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full w-12 h-12 p-0" 
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
          </div>
          
          <div className="flex gap-2 mt-6">
            {[...Array(4)].map((_, index) => (
              <div 
                key={index} 
                className={cn(
                  "w-3 h-3 rounded-full",
                  index < completedFocusSessions % 4 
                    ? "bg-primary" 
                    : "bg-muted"
                )}
              />
            ))}
          </div>
          
          <div className="w-full mt-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Focus Duration: {focusDuration} min</Label>
              </div>
              <Slider
                value={[focusDuration]}
                min={5}
                max={60}
                step={5}
                onValueChange={(value) => setFocusDuration(value[0])}
                disabled={isRunning}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Short Break: {shortBreakDuration} min</Label>
              </div>
              <Slider
                value={[shortBreakDuration]}
                min={1}
                max={15}
                step={1}
                onValueChange={(value) => setShortBreakDuration(value[0])}
                disabled={isRunning}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Long Break: {longBreakDuration} min</Label>
              </div>
              <Slider
                value={[longBreakDuration]}
                min={5}
                max={30}
                step={5}
                onValueChange={(value) => setLongBreakDuration(value[0])}
                disabled={isRunning}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Session tracking panel */}
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-select">Working On</Label>
            <Select
              value={selectedTaskId}
              onValueChange={(value) => setSelectedTaskId(value)}
              disabled={isRunning || isLoadingTasks}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a task (optional)" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="session-notes">Session Notes</Label>
            <Textarea
              id="session-notes"
              placeholder="Add notes about this study session"
              rows={4}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
            />
          </div>
          
          <div className="pt-2">
            <Label className="text-sm text-muted-foreground mb-2 block">
              Sessions completed today: {completedFocusSessions}
            </Label>
            
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    "rounded-md border flex items-center justify-center py-3",
                    i < completedFocusSessions % 4 
                      ? "bg-primary/20 border-primary" 
                      : "border-border"
                  )}
                >
                  {i < completedFocusSessions % 4 && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
            
            {completedFocusSessions >= 4 && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                You've completed {Math.floor(completedFocusSessions / 4)} full cycles!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyTimer;
