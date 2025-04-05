
import { AppError } from "@/lib/error";

// Types
export type QuestionCategory = {
  id: string;
  name: string;
  count: number;
}

export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  categoryId: string;
}

export type StudyMaterial = {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'text';
  fileSize: string;
  uploadDate: Date;
}

export type TaskCategory = 'homework' | 'reading' | 'research' | 'preparation' | 'exam' | 'other';
export type TaskPriority = 'high' | 'medium' | 'low';

export type StudyTask = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  category?: TaskCategory;
  priority?: TaskPriority; 
  description?: string;
  createdAt: Date;
  estimatedTime?: number; // In minutes
}

export type StudyEvent = {
  id: string;
  date: Date;
  title: string;
  description?: string;
  type: 'exam' | 'assignment' | 'class' | 'other';
}

export type StudySession = {
  id: string;
  start: Date;
  end?: Date;
  duration: number; // In minutes
  taskId?: string;
  notes?: string;
}

// Mock data
const categories: QuestionCategory[] = [
  { id: "constitutional", name: "Constitutional Law", count: 24 },
  { id: "criminal", name: "Criminal Law", count: 18 },
  { id: "contract", name: "Contract Law", count: 15 },
  { id: "tort", name: "Tort Law", count: 12 },
  { id: "property", name: "Property Law", count: 9 },
];

const questions: Question[] = [
  {
    id: 1,
    question: "Which of the following is NOT protected by the First Amendment?",
    options: [
      "Political speech",
      "Religious expression",
      "Incitement to imminent lawless action",
      "Peaceful assembly"
    ],
    correctAnswer: "Incitement to imminent lawless action",
    explanation: "The First Amendment protects freedom of speech, religion, press, assembly, and petition, but does not protect speech that is intended to incite imminent lawless action.",
    categoryId: "constitutional"
  },
  {
    id: 2,
    question: "What does the doctrine of stare decisis require?",
    options: [
      "Courts must follow precedents established by higher courts",
      "All laws must be written in Latin",
      "Judges must be appointed, not elected",
      "Legal disputes must be resolved through mediation first"
    ],
    correctAnswer: "Courts must follow precedents established by higher courts",
    explanation: "Stare decisis is Latin for 'to stand by things decided.' It requires courts to follow precedents established by higher courts in the same jurisdiction.",
    categoryId: "constitutional"
  },
  {
    id: 3,
    question: "What element is required for a valid contract?",
    options: [
      "Written documentation",
      "Consideration",
      "At least three parties",
      "Notarization"
    ],
    correctAnswer: "Consideration",
    explanation: "Consideration, something of value exchanged by the parties, is a required element for a valid contract. Written documentation, notarization, and three parties are not always required.",
    categoryId: "contract"
  },
  {
    id: 4,
    question: "What is the primary purpose of tort law?",
    options: [
      "To punish criminals",
      "To compensate injured parties",
      "To enforce contracts",
      "To interpret the Constitution"
    ],
    correctAnswer: "To compensate injured parties",
    explanation: "Tort law is primarily concerned with providing remedies, usually in the form of monetary damages, to individuals who have suffered harm due to the wrongful acts of others.",
    categoryId: "tort"
  }
];

const studyMaterials: StudyMaterial[] = [
  {
    id: "mat1",
    title: "Constitutional Law Notes.pdf",
    type: "pdf",
    fileSize: "2.4 MB",
    uploadDate: new Date(2025, 2, 15)
  },
  {
    id: "mat2",
    title: "Contract Law Lecture 3.mp4",
    type: "video",
    fileSize: "45.7 MB",
    uploadDate: new Date(2025, 2, 10)
  },
  {
    id: "mat3",
    title: "Tort Law Case Studies.pdf",
    type: "pdf",
    fileSize: "3.8 MB",
    uploadDate: new Date(2025, 1, 28)
  }
];

const studyTasks: StudyTask[] = [
  { 
    id: "task1", 
    title: "Read Chapter 5: Constitutional Law", 
    completed: false, 
    category: "reading",
    priority: "high",
    dueDate: new Date(2025, 3, 10),
    createdAt: new Date(2025, 3, 5),
    estimatedTime: 60
  },
  { 
    id: "task2", 
    title: "Review case notes: Brown v. Board of Education", 
    completed: true,
    category: "preparation",
    priority: "medium",
    createdAt: new Date(2025, 3, 3),
    estimatedTime: 45
  },
  { 
    id: "task3", 
    title: "Practice essay questions on Property Law", 
    completed: false,
    category: "homework",
    priority: "medium",
    dueDate: new Date(2025, 3, 12),
    createdAt: new Date(2025, 3, 6),
    estimatedTime: 90
  },
  { 
    id: "task4", 
    title: "Create flashcards for Legal Terms", 
    completed: false,
    category: "preparation",
    priority: "low",
    createdAt: new Date(2025, 3, 4),
    estimatedTime: 30
  },
  { 
    id: "task5", 
    title: "Watch lecture on Criminal Procedure", 
    completed: true,
    category: "other",
    priority: "high",
    createdAt: new Date(2025, 3, 2),
    estimatedTime: 120
  },
];

const studyEvents: StudyEvent[] = [
  { 
    id: "event1",
    date: new Date(2025, 3, 12), 
    title: "Constitutional Law Exam",
    type: "exam" 
  },
  { 
    id: "event2",
    date: new Date(2025, 3, 15), 
    title: "Property Law Assignment Due",
    type: "assignment",
    description: "Final case study analysis due by 11:59 PM"
  },
  { 
    id: "event3",
    date: new Date(2025, 3, 20), 
    title: "Criminal Law Mock Trial",
    type: "other" 
  },
  { 
    id: "event4",
    date: new Date(2025, 3, 8), 
    title: "Contract Law Lecture",
    type: "class",
    description: "Room 302B, Professor Johnson"
  },
];

const studySessions: StudySession[] = [
  {
    id: "session1",
    start: new Date(2025, 3, 1, 14, 0), // April 1, 2025, 2:00 PM
    end: new Date(2025, 3, 1, 16, 0),   // April 1, 2025, 4:00 PM
    duration: 120,
    taskId: "task1",
    notes: "Completed reading first half of the chapter"
  },
  {
    id: "session2",
    start: new Date(2025, 3, 2, 10, 0), // April 2, 2025, 10:00 AM
    end: new Date(2025, 3, 2, 11, 30),  // April 2, 2025, 11:30 AM
    duration: 90,
    taskId: "task2",
    notes: "Reviewed all key points from the case"
  },
];

// Generate a unique ID
const generateId = (prefix: string) => {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Service functions with error handling
export const dataService = {
  // Categories
  getCategories: async (): Promise<QuestionCategory[]> => {
    try {
      await delay(800);
      return [...categories];
    } catch (error) {
      throw new AppError("Failed to fetch categories", 500);
    }
  },
  
  // Questions
  getQuestionsByCategory: async (categoryId: string): Promise<Question[]> => {
    try {
      await delay(1000);
      const filteredQuestions = questions.filter(q => q.categoryId === categoryId);
      
      if (filteredQuestions.length === 0) {
        throw new AppError(`No questions found for category: ${categoryId}`, 404);
      }
      
      return filteredQuestions;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to fetch questions", 500);
    }
  },
  
  // Study Materials
  getStudyMaterials: async (): Promise<StudyMaterial[]> => {
    try {
      await delay(600);
      return [...studyMaterials];
    } catch (error) {
      throw new AppError("Failed to fetch study materials", 500);
    }
  },
  
  uploadMaterial: async (file: File): Promise<StudyMaterial> => {
    try {
      await delay(1500); // Simulate upload time
      
      // Validation
      if (file.size > 100000000) { // 100MB
        throw new AppError("File too large", 400);
      }
      
      const fileType = file.name.endsWith('.pdf') ? 'pdf' : 
                       file.name.endsWith('.mp4') || file.name.endsWith('.mov') ? 'video' : 'text';
                       
      const newMaterial: StudyMaterial = {
        id: `mat${studyMaterials.length + 1}`,
        title: file.name,
        type: fileType as 'pdf' | 'video' | 'text',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date()
      };
      
      studyMaterials.push(newMaterial);
      return newMaterial;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to upload file", 500);
    }
  },
  
  // Study Tasks
  getTasks: async (): Promise<StudyTask[]> => {
    try {
      await delay(700);
      return [...studyTasks];
    } catch (error) {
      throw new AppError("Failed to fetch tasks", 500);
    }
  },
  
  getTaskById: async (taskId: string): Promise<StudyTask> => {
    try {
      await delay(300);
      const task = studyTasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new AppError(`Task not found: ${taskId}`, 404);
      }
      
      return {...task};
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to fetch task", 500);
    }
  },
  
  addTask: async (task: Omit<StudyTask, 'id'>): Promise<StudyTask> => {
    try {
      await delay(800);
      
      const newTask: StudyTask = {
        ...task,
        id: generateId('task'),
      };
      
      studyTasks.push(newTask);
      return newTask;
    } catch (error) {
      throw new AppError("Failed to add task", 500);
    }
  },
  
  updateTask: async (taskId: string, updates: Partial<StudyTask>): Promise<StudyTask> => {
    try {
      await delay(500);
      const taskIndex = studyTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        throw new AppError(`Task not found: ${taskId}`, 404);
      }
      
      studyTasks[taskIndex] = {
        ...studyTasks[taskIndex],
        ...updates
      };
      
      return {...studyTasks[taskIndex]};
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update task", 500);
    }
  },
  
  toggleTaskCompletion: async (taskId: string): Promise<StudyTask> => {
    try {
      await delay(500);
      const task = studyTasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new AppError(`Task not found: ${taskId}`, 404);
      }
      
      task.completed = !task.completed;
      return {...task};
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update task", 500);
    }
  },
  
  deleteTask: async (taskId: string): Promise<boolean> => {
    try {
      await delay(600);
      const taskIndex = studyTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        throw new AppError(`Task not found: ${taskId}`, 404);
      }
      
      studyTasks.splice(taskIndex, 1);
      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to delete task", 500);
    }
  },
  
  // Study Events
  getEvents: async (): Promise<StudyEvent[]> => {
    try {
      await delay(800);
      return [...studyEvents];
    } catch (error) {
      throw new AppError("Failed to fetch events", 500);
    }
  },
  
  addEvent: async (event: Omit<StudyEvent, 'id'>): Promise<StudyEvent> => {
    try {
      await delay(800);
      
      const newEvent: StudyEvent = {
        ...event,
        id: generateId('event'),
      };
      
      studyEvents.push(newEvent);
      return newEvent;
    } catch (error) {
      throw new AppError("Failed to add event", 500);
    }
  },
  
  // Study Sessions
  getSessions: async (): Promise<StudySession[]> => {
    try {
      await delay(700);
      return [...studySessions];
    } catch (error) {
      throw new AppError("Failed to fetch study sessions", 500);
    }
  },
  
  startSession: async (taskId?: string): Promise<StudySession> => {
    try {
      await delay(300);
      
      const newSession: StudySession = {
        id: generateId('session'),
        start: new Date(),
        duration: 0,
        taskId
      };
      
      studySessions.push(newSession);
      return newSession;
    } catch (error) {
      throw new AppError("Failed to start study session", 500);
    }
  },
  
  endSession: async (sessionId: string, notes?: string): Promise<StudySession> => {
    try {
      await delay(500);
      const sessionIndex = studySessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        throw new AppError(`Session not found: ${sessionId}`, 404);
      }
      
      const session = studySessions[sessionIndex];
      const end = new Date();
      
      // Calculate duration in minutes
      const durationMs = end.getTime() - session.start.getTime();
      const durationMinutes = Math.round(durationMs / (1000 * 60));
      
      studySessions[sessionIndex] = {
        ...session,
        end,
        duration: durationMinutes,
        notes: notes || session.notes
      };
      
      return {...studySessions[sessionIndex]};
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to end study session", 500);
    }
  },
  
  getProductivityStats: async (): Promise<{
    tasksCompleted: number;
    totalStudyTime: number;
    averageSessionLength: number;
  }> => {
    try {
      await delay(900);
      
      const tasksCompleted = studyTasks.filter(t => t.completed).length;
      const totalStudyTime = studySessions.reduce((total, session) => total + session.duration, 0);
      const averageSessionLength = studySessions.length > 0 
        ? totalStudyTime / studySessions.length
        : 0;
      
      return {
        tasksCompleted,
        totalStudyTime,
        averageSessionLength
      };
    } catch (error) {
      throw new AppError("Failed to calculate productivity stats", 500);
    }
  }
};
